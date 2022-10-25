import { useState } from "react";
import ArrowDropdown from "../../utils/svg/ArrowDropdown";
import styles from "./ContainerDropdownV2.module.css"

export default function ContainerDropdownV2({title, subtitle, children}) {
    const [open, setOpen] = useState(true)

    const handleAction = () => {
        setOpen(!open) 
    }

    return (
        <div className={styles.container}>
            <div className={styles.header} onClick={handleAction}>
                <div>
                    <p className={open ? styles.underline : ''}>{title}</p>
                    <h3>{subtitle}</h3>
                </div>
                <ArrowDropdown className={open ? styles.triangule_inverse : styles.triangule} />
            </div>
            {open && children}
        </div>
    )
}