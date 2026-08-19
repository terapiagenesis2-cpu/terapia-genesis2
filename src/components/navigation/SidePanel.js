import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

// ─────────────────────────────────────────────────────────────
// ASSETS — URLs de Figma (válidas 7 días). Reemplazá por tus
// assets locales en /images/simbolos/ o /genesis-assets/ cuando
// expiren.
// ─────────────────────────────────────────────────────────────
const ICON_LEGADO   = "/images/icon_legado.png"; // iconos-01 → legado
const ICON_INICIO   = "/images/icon_inicio.png";; // iconos-02 → inicio
const ICON_ORAC     = "/images/icon_oraciones.png";; // iconos-03 → oraciones
const ICON_BORRAR   = "/images/icon_borrado.png";; // iconos-04 → borrar
const ICON_PDF      = "/images/icon_guardarPDF.png";; // iconos-05 → pdf
const ICON_RAMIF    = "/images/icon_ramificar.png";; // iconos-06 → ramificar
// Corrección usa tu asset local existente
const ICON_CORRECCION = "/images/simbolos/correccion2.png";

// ─────────────────────────────────────────────────────────────
// TABS
// ─────────────────────────────────────────────────────────────
const TABS = ['Acciones', 'Terapias'];

// ─────────────────────────────────────────────────────────────
// ITEMS del panel — cada uno recibe su handler via props
// ─────────────────────────────────────────────────────────────
const ITEMS = [
  { key: 'legado',   label: 'Volver al legado', icon: ICON_LEGADO,  tab: 'Acciones' },
  { key: 'inicio',   label: 'Inicio',            icon: ICON_INICIO,  tab: 'Acciones' },
  { key: 'oraciones',label: 'Oraciones',          icon: ICON_ORAC,    tab: 'Acciones' },
  { key: 'borrar',   label: 'Borrar último',      icon: ICON_BORRAR,  tab: 'Acciones' },
  { key: 'pdf',        label: 'Guardar como PDF',   icon: ICON_PDF,        tab: 'Acciones' },
  { key: 'ramificar',  label: 'Ramificar',           icon: ICON_RAMIF,      tab: 'Acciones' },
  { key: 'correccion', label: 'Trabajando Legado',   icon: ICON_CORRECCION, tab: 'Acciones' },
];

// ─────────────────────────────────────────────────────────────
// ANIMACIONES
// ─────────────────────────────────────────────────────────────
const slideIn = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
`;
const slideOut = keyframes`
  from { transform: translateX(0);    opacity: 1; }
  to   { transform: translateX(100%); opacity: 0; }
`;

// ─────────────────────────────────────────────────────────────
// COMPONENTE
//
// Props:
//   isOpen           boolean  — controla visibilidad del panel
//   onToggle         fn       — abre/cierra el panel
//   isRamificando    boolean  — resalta botón ramificar
//   isCorreccion     boolean  — resalta botón corrección/legado
//   mostrarCorreccion boolean — solo muestra corrección en ciertas rutas
//   onRamificar      fn
//   onBorrar         fn
//   onPDF            fn
//   onOraciones      fn
//   onInicio         fn
//   onLegado         fn
//   onCorreccion     fn
//   onTerapias       fn       — acción tab Terapias (opcional)
// ─────────────────────────────────────────────────────────────
const SidePanel = ({
  isOpen,
  onToggle,
  isRamificando,
  isCorreccion,
  mostrarCorreccion,
  onRamificar,
  onBorrar,
  onPDF,
  onOraciones,
  onInicio,
  onLegado,
  onCorreccion,
  onTerapias,
}) => {
  const [activeTab, setActiveTab] = useState('Acciones');

  const handlerMap = {
    legado:     onLegado,
    inicio:     onInicio,
    oraciones:  onOraciones,
    borrar:     onBorrar,
    pdf:        onPDF,
    ramificar:  onRamificar,
    correccion: onCorreccion,
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'Terapias' && onTerapias) onTerapias();
  };

  // Filtra corrección según la ruta y el tab activo
  const visibleItems = ITEMS.filter(i => {
    if (i.tab !== activeTab) return false;
    if (i.key === 'correccion' && !mostrarCorreccion) return false;
    return true;
  });

  return (
    <>
      {/* Botón toggle — la flechita > del Figma */}
      <ToggleBtn onClick={onToggle} $open={isOpen} aria-label="Abrir panel">
        <Arrow $open={isOpen}>›</Arrow>
      </ToggleBtn>

      {/* Overlay semitransparente cuando está abierto */}
      {isOpen && <Overlay onClick={onToggle} />}

      {/* Panel lateral */}
      <Panel $open={isOpen}>

        {/* Encabezado con tabs */}
        <PanelHeader>
          {TABS.map(tab => (
            <TabBtn
              key={tab}
              $active={activeTab === tab}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
              {activeTab === tab && <TabUnderline />}
            </TabBtn>
          ))}
          <Divider />
        </PanelHeader>

        {/* Lista de acciones */}
        <ItemList>
          {visibleItems.map(item => {
            const isRamifBtn  = item.key === 'ramificar';
            const isCorrecBtn = item.key === 'correccion';
            const isActive    = (isRamifBtn && isRamificando) || (isCorrecBtn && isCorreccion);
            return (
              <Item
                key={item.key}
                onClick={() => {
                  const handler = handlerMap[item.key];
                  if (handler) handler();
                }}
                $active={isActive}
              >
                <IconWrap>
                  <img src={item.icon} alt={item.label} />
                </IconWrap>
                <ItemLabel $active={isActive}>
                  {item.label}
                  {isActive && <ActiveDot />}
                </ItemLabel>
              </Item>
            );
          })}

          {activeTab === 'Terapias' && (
            <EmptyMsg>Sin terapias disponibles</EmptyMsg>
          )}
        </ItemList>

      </Panel>
    </>
  );
};

export default SidePanel;

// ══════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ══════════════════════════════════════════════════════════════

/* Botón flotante con la flecha, pegado al borde derecho */
const ToggleBtn = styled.button`
  position: fixed;
  right: ${({ $open }) => ($open ? '374px' : '0px')};
  top: 50%;
  transform: translateY(-50%);
  z-index: 1100;
  width: 24px;
  height: 120px;
  background: rgba(30, 30, 30, 0.92);
  border: 1px solid rgba(255,255,255,0.12);
  border-right: none;
  border-radius: 10px 0 0 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s;
  &:hover { background: rgba(50, 50, 50, 0.95); }

  @media (max-width: 420px) {
    right: ${({ $open }) => ($open ? 'calc(100vw - 24px)' : '0px')};
  }
`;

const Arrow = styled.span`
  color: #00FFB2;
  font-size: 28px;
  line-height: 1;
  display: block;
  transform: ${({ $open }) => ($open ? 'rotate(0deg)' : 'rotate(180deg)')};
  transition: transform 0.3s ease;
`;

/* Overlay que cierra el panel al hacer clic fuera */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1050;
  background: transparent;
`;

/* Panel lateral deslizante */
const Panel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: ${({ $open }) => ($open ? '374px' : '0px')};
  z-index: 1090;
  background: rgba(18, 18, 18, 0.97);
  backdrop-filter: blur(12px);
  box-shadow: -4px 0 24px rgba(0,0,0,0.6);
  display: flex;
  flex-direction: column;
  border-radius: 10px 0 0 10px;
  overflow: hidden;
  transform: translateX(0);
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};

  @media (max-width: 420px) {
    width: 100vw;
  }
`;

/* Cabecera del panel */
const PanelHeader = styled.div`
  padding: 48px 24px 0;
  display: flex;
  align-items: flex-end;
  gap: 24px;
  position: relative;
`;

const Divider = styled.div`
  position: absolute;
  bottom: 0;
  left: 24px;
  right: 24px;
  height: 1px;
  background: rgba(255,255,255,0.1);
`;

const TabBtn = styled.button`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 0 14px;
  font-family: 'Inter', sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: ${({ $active }) => ($active ? '#ffffff' : '#828181')};
  transition: color 0.2s;
  &:hover { color: #ccc; }
`;

const TabUnderline = styled.span`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #ffffff;
  border-radius: 2px;
`;

/* Lista de ítems */
const ItemList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 12px 0;
  flex: 1;
  overflow-y: auto;
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 22px 28px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.18s;
  background: ${({ $active }) => ($active ? 'rgba(0,255,178,0.07)' : 'transparent')};

  &:hover {
    background: rgba(255,255,255,0.06);
  }
`;

const IconWrap = styled.div`
  width: 40px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    filter: brightness(0) invert(1);
    opacity: 0.9;
  }
`;

const ItemLabel = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: ${({ $active }) => ($active ? 1 : 0.88)};
`;

const ActiveDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00FFB2;
  box-shadow: 0 0 8px #00FFB2;
`;

const EmptyMsg = styled.li`
  padding: 32px 28px;
  color: rgba(255,255,255,0.3);
  font-family: 'Inter', sans-serif;
  font-size: 14px;
`;
