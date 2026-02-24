import React from "react";
import { FirebaseProvider } from "./src/components/FirebaseContext";
import { RamificacionProvider } from "./src/context/RamificacionContext";
import { CorreccionProvider } from "./src/context/LegadoContext";

export const wrapRootElement = ({ element }) => (
  <FirebaseProvider>
    <RamificacionProvider>
      <CorreccionProvider>{element}</CorreccionProvider>
    </RamificacionProvider>
  </FirebaseProvider>
);