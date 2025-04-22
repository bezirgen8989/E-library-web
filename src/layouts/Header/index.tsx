import { PropsWithChildren, useEffect, useState } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
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
import { useAuthState } from "../../modules/Auth/slices/auth";
import { Button } from "antd";
import { icons } from "@layouts/Header/menuItems/icons";

type Props = {};

export const Header = ({ children }: PropsWithChildren<Props>) => {
  const { t } = useTranslation();
  const [hasNotifications] = useState(true);
  const { pathname } = useLocation(); // Получаем текущий путь
  const dispatch = useDispatch();
  const {
    userData: { result },
  } = useAuthState();

  useEffect(() => {
    dispatch(checkNewNotifications());
  }, []);

  const showDrawer = () => {
    dispatch(setDrawerOpen(true));
  };

  const darkPage = pathname.includes("ask_question");

  // Анахуя? если оно не работает?
  // const difStyles =
  //   location.pathname === userRoutes.profile ||
  //   /^\/search_genre_books\/\d+$/.test(location.pathname) ||
  //   /^\/audio_book\/\d+$/.test(location.pathname);

  return (
    <>
      <div
        style={{ overflow: "hidden" }}
        className={cn(styles.headerDesktop, {
          [styles.askQuestionPageHeader]: darkPage,
        })}
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
        <div className={styles.profileElementsWrapper}>
          <div className={styles.headerNotifications} onClick={showDrawer}>
            {hasNotifications && <div className={styles.dot} />}
            <img src={bell} alt="bell" />
          </div>

          <Button
            style={{ padding: 0 }}
            href={userRoutes.profile}
            className={cn(styles.dropdown, {
              [styles.dropdownLight]: !darkPage,
              [styles.dropdownDark]: darkPage,
            })}
            icon={
              <div className={styles.headerAvatar}>
                <img
                  src={result?.photo?.link ? result?.photo?.link : noAvatar}
                  alt="User avatar"
                />
              </div>
            }
          >
            <div className={styles.dropdownTitle}>
              {result?.userName ? result?.userName : result?.email}
              <span>{icons["arrow"]}</span>
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
    </>
  );
};
