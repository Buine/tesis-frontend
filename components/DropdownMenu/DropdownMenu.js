import { useState } from "react"
import styles from "./DropdownMenu.module.css"

export default function DropdownMenu({ children, actionComponent }) {
    const [open, setOpen] = useState(false)
    return (
        <div className={styles.container}>
            <div className={styles.action_component} onClick={() => setOpen(!open)}>{actionComponent}</div>
            {open && <div className={styles.dropdown}>
                {children}
            </div>}
        </div>
    )
}