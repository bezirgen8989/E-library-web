import { SideDrawer } from "../../components/common";

const AppLayer: React.FC = ({ children }) => {
  return (
    <>
      <SideDrawer />
      {children}
    </>
  );
};

export default AppLayer;
