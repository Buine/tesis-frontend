import { useState } from "react";
import styles from "./ContainerDropdown.module.css"

export default function ContainerDropdown({text, children}) {
    const [open, setOpen] = useState(false)

    const handleAction = () => {
        setOpen(!open)
    }

    return (
        <div className={styles.container}>
            <div className={styles.header} onClick={handleAction}>
                <h3 className={open ? styles.underline : ''}>{text}</h3>
                <div className={open ? styles.triangule : styles.triangule_inverse}></div>
            </div>
            {open && children}
        </div>
    )
}