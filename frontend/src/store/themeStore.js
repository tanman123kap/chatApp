import {create} from "zustand";

export const themeStore = create((set) => ({
    theme: localStorage.getItem("theme"),
    setTheme: (theme) => {
        localStorage.setItem("theme", theme);
        set({theme});
    }
}));