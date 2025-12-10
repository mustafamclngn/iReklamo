import { useLayoutEffect } from "react";

export default function useLockBodyScroll(isLocked) {

    console.log("Locked Out Modal: ", isLocked)

    useLayoutEffect(() => {
        const target = document.documentElement;

        if (isLocked) {
        const scrollbarWidth =
            window.innerWidth - target.clientWidth;

        target.style.overflow = "hidden";
        target.style.paddingRight = `${scrollbarWidth}px`;
        } else {
        target.style.overflow = "";
        target.style.paddingRight = "";
        }

        return () => {
        target.style.overflow = "";
        target.style.paddingRight = "";
        };
        
}, [isLocked]);
}
