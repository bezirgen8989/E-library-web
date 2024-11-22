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
  const { categories } = useLazySelector(({ auth }) => {
    const { categories } = auth;
    return {
      categories,
    };
  });

  const { currentCategoryId } = useLazySelector(({ home }) => {
    const { currentCategoryId } = home;
    return {
      currentCategoryId,
    };
  });

  useEffect(() => {
    // Dispatch action to fetch categories if not already fetched
    if (!categories) {
      dispatch(getCategories());
    }
  }, [dispatch, categories]);

  const location = useLocation();

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;

    if (
      /^\/search_books\/\d+$/.test(location.pathname) &&
      categories?.result?.data
    ) {
      const categoryId = parseInt(currentCategoryId, 10);
      const category = categories.result.data.find(
        (category: Category) => category.id === categoryId
      );
      if (category) {
        root.style.background = category.color || "white"; // Use category color if found
      } else {
        root.style.background = "white"; // Default background if no category is found
      }
    } else {
      // Handle other routes
      switch (true) {
        case location.pathname.startsWith(authRoutes.root):
          root.style.background =
            "linear-gradient(to bottom, #d3a271, #a46542)";
          break;
        case location.pathname === rootRoutes.root:
          root.style.background = "#FBF1EA";
          break;
        case location.pathname === userRoutes.profile:
          root.style.background =
            "linear-gradient(to bottom, #d3a271, #a46542)";
          break;
        case /^\/book\/\d+$/.test(location.pathname):
          root.style.background = "#FBF1EA";
          break;
        case location.pathname === homeRoutes.search:
          root.style.background = "#FBF1EA";
          break;
        default:
          root.style.background = "white";
      }
    }
  }, [location, categories, currentCategoryId]); // Re-run the effect when location, categories, id, or isLoading changes

  return null;
};
