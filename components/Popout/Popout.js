import { useEffect, useRef } from "react"
import styles from "./Popout.module.css"

export default function Popout({open = false, setOpen, ...props}) {
    const wrapperRef = useRef(null)
    useOutsideAlerter(wrapperRef, setOpen)

    return open && <div className={styles.popout}>
        <div className={styles.popout_inner} ref={wrapperRef}>
            {props.children}
        </div>
    </div>
}

function useOutsideAlerter(ref, setOpen) {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, setOpen]);
}