import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import authRoutes from "../modules/Auth/routing/routes";
import rootRoutes from "../routing/routes";
import userRoutes from "../modules/UserManagement/routing/routes";
import homeRoutes from "../modules/Home/routing/routes";
import { useLazySelector } from "../hooks";
import { getCategories } from "../modules/Auth/slices/auth";
import { useDispatch } from "react-redux";

type Category = {
  id: number;
  color?: string;
};

export const BackgroundUpdater = () => {
  const dispatch = useDispatch();
  const { categories } = useLazySelector(({ auth }) => auth);
  const { currentCategoryId } = useLazySelector(({ home }) => home);

  const location = useLocation();

  useEffect(() => {
    if (!categories) {
      dispatch(getCategories());
    }
  }, [dispatch, categories]);

  const getCategoryBackground = (): string | undefined => {
    if (/^\/search_genre_books\/\d+$/.test(location.pathname)) {
      const categoryId = parseInt(currentCategoryId, 10);
      const category = categories?.result?.data?.find(
        (cat: Category) => cat.id === categoryId
      );
      return category?.color || "white";
    }
    return undefined;
  };

  const getRouteBackground = (): string => {
    const routeBackgrounds: Record<string, string> = {
      [authRoutes.login]: "linear-gradient(to bottom, #d3a271, #a46542)",
      [authRoutes.onboarding]: "linear-gradient(to bottom, #d3a271, #a46542)",
      [authRoutes.registration]: "linear-gradient(to bottom, #d3a271, #a46542)",
      [authRoutes.profileAbout]: "linear-gradient(to bottom, #d3a271, #a46542)",
      [authRoutes.forgot]: "linear-gradient(to bottom, #d3a271, #a46542)",
      [authRoutes.recoverPassword]:
        "linear-gradient(to bottom, #d3a271, #a46542)",
      [authRoutes.changePassword]:
        "linear-gradient(to bottom, #d3a271, #a46542)",
      [authRoutes.verifyEmailSuccess]:
        "linear-gradient(to bottom, #d3a271, #a46542)",
      [authRoutes.enterCode]: "linear-gradient(to bottom, #d3a271, #a46542)",
      [authRoutes.ProfileHabits]:
        "linear-gradient(to bottom, #d3a271, #a46542)",
      [authRoutes.Profile]: "linear-gradient(to bottom, #d3a271, #a46542)",
      [authRoutes.Error404]: "linear-gradient(to bottom, #d3a271, #a46542)",
      [rootRoutes.root]: "#FBF1EA",
      [userRoutes.profile]: "linear-gradient(to bottom, #d3a271, #a46542)",
      [homeRoutes.search]: "#FBF1EA",
      [homeRoutes.reading]: "#FBF1EA",
      [homeRoutes.newBooks]: "#FBF1EA",
      [homeRoutes.suggestedBooks]: "#FBF1EA",
      [homeRoutes.authorBooks]: "#FBF1EA",
      [homeRoutes.similarBooks]: "#FBF1EA",
      [homeRoutes.booksShelf]: "#FBF1EA",
      [homeRoutes.startedBooks]: "#FBF1EA",
      [homeRoutes.notStartedBooks]: "#FBF1EA",
      [homeRoutes.finishedBooks]: "#FBF1EA",
      [homeRoutes.searchTopBooks]: "#FBF1EA",
      [homeRoutes.searchNewBooks]: "#FBF1EA",
      [homeRoutes.askQuestionAll]: "#00191e",
      [homeRoutes.chooseAvatar]: "#00191e",
    };

    if (
      /^\/(search_top_books|search_new_books)\/\d+$/.test(location.pathname)
    ) {
      return "#FBF1EA";
    }
    if (/^\/(reading)\/\d+$/.test(location.pathname)) {
      return "#FBF1EA";
    }
    if (/^\/(ask_question)\/\d+$/.test(location.pathname)) {
      return "#00191e";
    }
    if (/^\/author_books\/\d+$/.test(location.pathname)) {
      return "#FBF1EA";
    }

    if (/^\/book\/\d+$/.test(location.pathname)) {
      return "#FBF1EA";
    }

    return routeBackgrounds[location.pathname] || "white";
  };

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;

    const categoryBackground = getCategoryBackground();
    root.style.background = categoryBackground || getRouteBackground();
  }, [location, categories, currentCategoryId]);

  return null;
};
