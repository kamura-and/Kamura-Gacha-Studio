import { RouterProvider } from "react-router-dom";

import { router } from "@/app/router/AppRouter";

function App() {
  return <RouterProvider router={router} />;
}

export default App;