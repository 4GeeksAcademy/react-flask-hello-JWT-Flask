import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { LoginSignup } from "./pages/loginSignup";  // Ruta para el registro
import { Private } from "./pages/Private";  // Ruta para la página privada

export const router = createBrowserRouter(
  createRoutesFromElements(
    // Rutas principales
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={ <Single />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/loginSignup" element={<LoginSignup />} />

      <Route
        path="/private"
        element={
          <Private />
        }
      />
    </Route>
  )
);
