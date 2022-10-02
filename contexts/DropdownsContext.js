import { createContext, useContext, useMemo, useState } from "react"

export const DropdownsContext = createContext(null)
export const useDropdownsContext = () => useContext(DropdownsContext)

export function DropdownsProvider({children}) {
    const [openDropdown, setOpenDropdown] = useState(-1)
    const DropdownsContextValues = useMemo(() => ({
        openDropdown,
        setOpenDropdown
    }), [openDropdown, setOpenDropdown])

    return <DropdownsContext.Provider value={DropdownsContextValues}>
        {children}
    </DropdownsContext.Provider>
}

