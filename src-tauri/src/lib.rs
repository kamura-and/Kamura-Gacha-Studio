use serde::Serialize;

const DEFAULT_RCON_ADDRESS: &str = "127.0.0.1:25575";

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

fn read_rcon_address() -> String {
  std::env::var("KAMURA_RCON_ADDRESS")
    .unwrap_or_else(|_| DEFAULT_RCON_ADDRESS.to_string())
}

fn read_rcon_password() -> Result<String, String> {
  let password =
    std::env::var("KAMURA_RCON_PASSWORD")
      .map_err(|_| {
        [
          "RCONパスワードが設定されていません。",
          "PowerShellでKAMURA_RCON_PASSWORDを設定してください。",
        ]
        .join("\n")
      })?;

  if password.trim().is_empty() {
    return Err(
      "KAMURA_RCON_PASSWORDが空です。".to_string(),
    );
  }

  Ok(password)
}

fn normalize_minecraft_command(
  command: String,
) -> Result<String, String> {
  let trimmed_command = command.trim();

  if trimmed_command.is_empty() {
    return Err(
      "Minecraftコマンドが空です。".to_string(),
    );
  }

  let normalized_command = trimmed_command
    .strip_prefix('/')
    .unwrap_or(trimmed_command)
    .trim();

  if normalized_command.is_empty() {
    return Err(
      "Minecraftコマンドが空です。".to_string(),
    );
  }

  Ok(normalized_command.to_string())
}

async fn connect_rcon(
) -> Result<
  rcon::Connection<tokio::net::TcpStream>,
  String,
> {
  let address = read_rcon_address();
  let password = read_rcon_password()?;

  log::info!(
    "Minecraft RCONへ接続します: {}",
    address
  );

  rcon::Connection::connect(
    address.as_str(),
    password.as_str(),
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
) -> Result<MinecraftConnectionTestResult, String> {
  let address = read_rcon_address();

  let mut connection = connect_rcon().await?;

  let response = connection
    .cmd("list")
    .await
    .map_err(|error| {
      format!(
        "接続後のテストコマンドに失敗しました: {error}"
      )
    })?;

  Ok(MinecraftConnectionTestResult {
    address,
    response,
  })
}

#[tauri::command]
async fn send_minecraft_command(
  command: String,
) -> Result<MinecraftCommandResult, String> {
  let normalized_command =
    normalize_minecraft_command(command)?;

  let mut connection = connect_rcon().await?;

  log::info!(
    "Minecraftコマンドを送信します: {}",
    normalized_command
  );

  let response = connection
    .cmd(normalized_command.as_str())
    .await
    .map_err(|error| {
      format!(
        "Minecraftコマンドの実行に失敗しました。コマンド: {normalized_command} / 詳細: {error}"
      )
    })?;

  log::info!(
    "Minecraftから応答を受信しました: {}",
    response
  );

  Ok(MinecraftCommandResult {
    command: normalized_command,
    response,
  })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      Ok(())
    })
    .invoke_handler(
      tauri::generate_handler![
        test_minecraft_connection,
        send_minecraft_command
      ],
    )
    .run(tauri::generate_context!())
    .expect(
      "error while running tauri application",
    );
}