use serde::Serialize;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct MinecraftCommandResult {
  command: String,
  response: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct MinecraftConnectionTestResult {
  address: String,
  response: String,
}

fn normalize_host(
  host: String,
) -> Result<String, String> {
  let normalized_host =
    host.trim().to_string();

  if normalized_host.is_empty() {
    return Err(
      "Minecraftのホストが設定されていません。"
        .to_string(),
    );
  }

  Ok(normalized_host)
}

fn normalize_password(
  password: String,
) -> Result<String, String> {
  if password.trim().is_empty() {
    return Err(
      "MinecraftのRCONパスワードが設定されていません。"
        .to_string(),
    );
  }

  Ok(password)
}

fn build_rcon_address(
  host: String,
  port: u16,
) -> Result<String, String> {
  let normalized_host =
    normalize_host(host)?;

  if port == 0 {
    return Err(
      "Minecraftのポート番号が正しくありません。"
        .to_string(),
    );
  }

  /*
   * IPv6アドレスの場合は、
   * host:portではなく[host]:port形式にします。
   */
  if normalized_host.contains(':')
    && !normalized_host.starts_with('[')
    && !normalized_host.ends_with(']')
  {
    return Ok(
      format!("[{normalized_host}]:{port}"),
    );
  }

  Ok(
    format!("{normalized_host}:{port}"),
  )
}

fn normalize_minecraft_command(
  command: String,
) -> Result<String, String> {
  let trimmed_command =
    command.trim();

  if trimmed_command.is_empty() {
    return Err(
      "Minecraftコマンドが空です。"
        .to_string(),
    );
  }

  let normalized_command =
    trimmed_command
      .strip_prefix('/')
      .unwrap_or(trimmed_command)
      .trim();

  if normalized_command.is_empty() {
    return Err(
      "Minecraftコマンドが空です。"
        .to_string(),
    );
  }

  Ok(
    normalized_command.to_string(),
  )
}

async fn connect_rcon(
  host: String,
  port: u16,
  password: String,
) -> Result<
  rcon::Connection<tokio::net::TcpStream>,
  String,
> {
  let address =
    build_rcon_address(
      host,
      port,
    )?;

  let normalized_password =
    normalize_password(password)?;

  log::info!(
    "Minecraft RCONへ接続します: {}",
    address,
  );

  rcon::Connection::connect(
    address.as_str(),
    normalized_password.as_str(),
  )
  .await
  .map_err(|error| {
    format!(
      "Minecraft RCONへの接続に失敗しました。接続先: {address} / 詳細: {error}"
    )
  })
}

#[tauri::command]
async fn test_minecraft_connection(
  host: String,
  port: u16,
  password: String,
) -> Result<
  MinecraftConnectionTestResult,
  String,
> {
  let address =
    build_rcon_address(
      host.clone(),
      port,
    )?;

  let mut connection =
    connect_rcon(
      host,
      port,
      password,
    )
    .await?;

  let response =
    connection
      .cmd("list")
      .await
      .map_err(|error| {
        format!(
          "接続後のテストコマンドに失敗しました: {error}"
        )
      })?;

  log::info!(
    "Minecraft RCON接続テストに成功しました: {}",
    address,
  );

  Ok(
    MinecraftConnectionTestResult {
      address,
      response,
    },
  )
}

#[tauri::command]
async fn send_minecraft_command(
  command: String,
  host: String,
  port: u16,
  password: String,
) -> Result<
  MinecraftCommandResult,
  String,
> {
  let normalized_command =
    normalize_minecraft_command(
      command,
    )?;

  let mut connection =
    connect_rcon(
      host,
      port,
      password,
    )
    .await?;

  log::info!(
    "Minecraftコマンドを送信します: {}",
    normalized_command,
  );

  let response =
    connection
      .cmd(
        normalized_command.as_str(),
      )
      .await
      .map_err(|error| {
        format!(
          "Minecraftコマンドの実行に失敗しました。コマンド: {normalized_command} / 詳細: {error}"
        )
      })?;

  log::info!(
    "Minecraftから応答を受信しました: {}",
    response,
  );

  Ok(
    MinecraftCommandResult {
      command: normalized_command,
      response,
    },
  )
}

#[cfg_attr(
  mobile,
  tauri::mobile_entry_point,
)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app
          .handle()
          .plugin(
            tauri_plugin_log::Builder::default()
              .level(
                log::LevelFilter::Info,
              )
              .build(),
          )?;
      }

      Ok(())
    })
    .invoke_handler(
      tauri::generate_handler![
        test_minecraft_connection,
        send_minecraft_command,
      ],
    )
    .run(
      tauri::generate_context!(),
    )
    .expect(
      "error while running tauri application",
    );
}