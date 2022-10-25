import { useEffect, useRef, useState } from "react"
import { useDropdownsContext } from "../../contexts/DropdownsContext"
import styles from "./DropdownMenu.module.css"

export default function DropdownMenu({ children, actionComponent, idx = 0 }) {
    const [open, setOpen] = useState(false)
    const {openDropdown, setOpenDropdown} = useDropdownsContext()
    const wrapperRef = useRef(null)
    const wrapperRefParent = useRef(null)
    // useOutsideAlerter(wrapperRef, wrapperRefParent,setOpen)

    useEffect(() => {
        if (openDropdown != idx) {
            setOpen(false)
        }
    }, [idx, openDropdown])

    return (
        <div className={styles.container} ref={wrapperRefParent}>
            <div className={styles.action_component} onClick={() => {
                setOpen(!open)
                setOpenDropdown(idx)
            }
        }>{actionComponent}</div>
            {open && <div className={styles.dropdown} ref={wrapperRef}>
                {children}
            </div>}
        </div>
    )
}

function useOutsideAlerter(ref, parentRef, setOpen) {
    useEffect(() => {
        function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target) && parentRef.current && !parentRef.current.contains(event.target)) {
            setOpen(false)
        }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, parentRef, setOpen]);
}


/*
    Condiciones cuando se usa un group
    
    1. Cuando agrupamos al final no podemos listar campos diferentes a los campos agrupadores
    (Hide filters deja de funcionar)

    2. Se necesita usar una funcion agregativa, (count, max, min, sum, avg)
    (Agrupar por el campo [x] 
        y luego [
        contar campos, 
        buscar el campo z con el valor maximo/min, 
        sumar el campo z, 
        sacar el promedio del campo z
    ])

*/