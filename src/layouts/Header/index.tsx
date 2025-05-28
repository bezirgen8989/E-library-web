import {
  PropsWithChildren,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { Link, useLocation, NavLink, useHistory } from "react-router-dom";
import userRoutes from "../../modules/UserManagement/routing/routes";
import {
  checkNewNotifications,
  setDrawerOpen,
} from "../../modules/Home/slices/home";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import logo from "../../assets/images/icons/appLogoBrown.svg";
import logoWhite from "../../assets/images/icons/appLogoWhite.svg";
import bell from "../../assets/images/icons/bellIcon.svg";
import noAvatar from "../../assets/images/icons/noUserAvatar.png";
import styles from "./styles.module.scss";
import { MenuItems } from "@layouts/Header/menuItems";
import cn from "classnames";
import { getMe, useAuthState } from "../../modules/Auth/slices/auth";
import { Button } from "antd";
import { icons } from "@layouts/Header/menuItems/icons";
import routes from "../../modules/UserManagement/routing/routes";

type Props = {};

const otherStyle = ["ask_question", "user", "choose_avatar", "audio_book"];

export const Header = ({ children }: PropsWithChildren<Props>) => {
  const { t } = useTranslation();
  const { push } = useHistory();
  const [hasNotifications] = useState(true);
  const { pathname } = useLocation(); // Получаем текущий путь
  const dispatch = useDispatch();
  const splitRoute = pathname.split("/");

  const {
    userData: { result },
  } = useAuthState();

  const user = useMemo(() => {
    if (result?.id) {
      return result;
    }
    return null;
  }, [result?.id]);

  useEffect(() => {
    dispatch(checkNewNotifications());
  }, []);

  const showDrawer = () => {
    dispatch(setDrawerOpen(true));
  };

  const darkPage = otherStyle.includes(splitRoute[1]);

  console.log(pathname);
  console.log(splitRoute[1]);

  useLayoutEffect(() => {
    if (!user?.id) {
      dispatch(getMe());
    }
  }, [user?.id]);

  const toProfilePage = () => {
    push(routes.profile);
  };

  return (
    <div
      className={cn(
        styles.layoutHeaderWrapper,
        styles[splitRoute[splitRoute.length - 1]]
      )}
    >
      <div
        style={{ overflow: "hidden" }}
        className={cn(
          styles.headerDesktop,
          styles[splitRoute[splitRoute.length - 1]]
        )}
      >
        <div className={styles.headerLogo}>
          <Link to="/">
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                height="41px"
                width="73px"
                src={!darkPage ? logo : logoWhite}
                alt="logo"
              />
            </div>
          </Link>
        </div>
        <nav
          className={cn(styles.headerNav, {
            [styles.lightHeaderNav]: !darkPage,
            [styles.darkHeaderNav]: darkPage,
          })}
        >
          {MenuItems(t).map((menuItem) => (
            <NavLink
              key={menuItem.to}
              to={menuItem.to}
              exact
              className={cn(styles.headerNavItem, {
                [styles.darkNavItem]: darkPage,
                [styles.lightNavItem]: !darkPage,
              })}
              activeClassName={cn({
                [styles.darkActive]: darkPage,
                [styles.active]: !darkPage,
              })}
            >
              <span className={styles.headerIcon}> {menuItem.icon} </span>
              <span> {menuItem.title} </span>
            </NavLink>
          ))}
        </nav>
        <span />
        <div className={styles.profileElementsWrapper}>
          <div className={styles.headerNotifications} onClick={showDrawer}>
            {hasNotifications && <div className={styles.dot} />}
            <img src={bell} alt="bell" />
          </div>
          <Button
            style={{ padding: 0 }}
            className={cn(styles.dropdown, {
              [styles.dropdownLight]: !darkPage,
              [styles.dropdownDark]: darkPage,
            })}
            onClick={toProfilePage}
            icon={
              <img
                className={styles.headerAvatar}
                src={result?.photo?.link ? result?.photo?.link : noAvatar}
                alt="User avatar"
              />
            }
          >
            <div className={styles.userNameTitle}>
              <div className={styles.dropdownTitle}>
                {result?.userName ? result?.userName : result?.email}
              </div>
              <div>{icons["arrow"]}</div>
            </div>
          </Button>
        </div>
      </div>

      <div className={styles.headerMobile}>
        <Link to={userRoutes.profile} className={styles.headerAvatar}>
          <img
            src={result?.photo?.link ? result?.photo?.link : noAvatar}
            alt=""
          />
        </Link>
        <div className={styles.pageTitle}>{t("menuItemHome")}</div>
        <div className={styles.headerNotifications} onClick={showDrawer}>
          {hasNotifications && <div className={styles.dot} />}
          <img src={bell} alt="bell" />
        </div>
      </div>
      <div className={styles.contentWrapper} style={{ overflow: "auto" }}>
        {children}
      </div>
    </div>
  );
};
