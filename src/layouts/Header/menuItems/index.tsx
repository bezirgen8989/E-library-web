import homeRoutes from "../../../modules/Home/routing/routes";
import { icons } from "@layouts/Header/menuItems/icons";
import { routes } from "../../../modules/Home/routing";

export const MenuItems = (t: any) => [
  {
    to: homeRoutes.root,
    icon: icons[homeRoutes.root],
    title: t("menuItemHome"),
  },
  {
    to: homeRoutes.booksShelf,
    icon: icons[homeRoutes.booksShelf],
    title: t("menuItemMyBookshelf"),
  },
  {
    to: routes.askQuestion,
    icon: icons[routes.askQuestion],
    title: t("menuItemAskQuestion"),
  },
  {
    to: homeRoutes.search,
    icon: icons[homeRoutes.search],
    title: t("menuItemSearch"),
  },
];
