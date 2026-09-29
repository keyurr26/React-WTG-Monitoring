import {
    ROLE_MENU_ACCESS
} from "../config/roleAccess";
import {
    NAV_MENUS
} from "../config/navMenuConfig";
import {
    useSelector
} from "react-redux";


// export const useRoleMenu = () => {

//     const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

//     if (!userInfo) return [];

//     const role = userInfo.role;

//     const allowedKeys = ROLE_MENU_ACCESS[role] || [];

//     return NAV_MENUS.filter(menu => allowedKeys.includes(menu.key));
// };


export const useRoleMenu = () => {
    // Use Redux instead of sessionStorage for "Single Source of Truth"
    const {
        user
    } = useSelector((state) => state.auth);

    if (!user || !user.role) return [];

    // Standardize role to lowercase to match your ROLE_MENU_ACCESS keys
    const roleKey = user.role.toLowerCase();
    const allowedKeys = ROLE_MENU_ACCESS[roleKey] || [];

    return NAV_MENUS.filter(menu => allowedKeys.includes(menu.key));
};