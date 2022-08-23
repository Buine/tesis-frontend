import { useRouter } from "next/router"
import { useState } from "react"

import styles from './Dropdown.module.css'

function Dropdown({ children, actionComponent }) {
    const [open, setOpen] = useState(false)

    return (
        <div onClick={() => setOpen(!open)}>
            {actionComponent}
            {open && <div className={styles.dropdown}>
                {children}
            </div>}
        </div>
    )
}

function DropdownItem({ text, linkTo, actionFunction = () => {} }) {
    const router = useRouter()

    const clickHandler = () => {
        actionFunction()
        if (linkTo) {
            router.push(linkTo)
        }
    }

    return (
        <div className={styles.dropdown_item} onClick={clickHandler}>
            {text}
        </div>
    )
}

export { Dropdown, DropdownItem }