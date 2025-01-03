import "assets/css/global.css";
import "normalize.css";
import { Provider } from "react-redux";
import store from "store";
import Router from "routing";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

const Root = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <Router />
      </Provider>
    </I18nextProvider>
  );
};

export default Root;
