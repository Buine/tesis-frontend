import SelectSearch from "react-select-search"
import InfoIcon from "../../utils/svg/InfoIcon";
import ContainerDropdownV2 from "../ContainerDropdownV2/ContainerDropdownV2"
import styles from "./QueryImport.module.css"

const textByTypes = {
    "MAIN": "Main table source:",
    "TABLE": "Merge table:",
    "QUERY": "Merge query:"
}

const options = [
    {
      type: "group",
      name: "public",
      items: [
        { name: "integration", value: "1" },
        { name: "users", value: "2" }
      ]
    },
    {
      type: "group",
      name: "admin",
      items: [
        { name: "user_group", value: "3" },
      ]
    }
  ];

  const handleFilter = (items) => {
    return (searchValue) => {
      if (searchValue.length === 0) {
        return options;
      }
      const updatedItems = items.map((list) => {
        const newItems = list.items.filter((item) => {
          return item.name.toLowerCase().includes(searchValue.toLowerCase());
        });
        return { ...list, items: newItems };
      });
      return updatedItems;
    };
  };

export default function QueryImport({type}) {
    let title = textByTypes[type]
    let isMain = type == "MAIN"
    let isQuery = type == "QUERY"

    return (
        <ContainerDropdownV2 title={title} subtitle={"Integration"}>
            <div className={styles.container}>
                <div className={styles.input_div}>
                    {!isQuery && <><label>Table</label>
                    <SelectSearch 
                        options={options}
                        filterOptions={handleFilter}
                        search
                    /></>}
                    {isQuery && <><label>Query</label>
                    <SelectSearch 
                        options={options}
                        filterOptions={handleFilter}
                        search
                    /></>}
                </div>
                <div className={styles.input_div}>
                    <label>Alias*</label>
                    <input className={styles.input}></input>
                </div>
                {!isMain && <div className={styles.input_div}>
                    <div className={styles.label_alt_title}>
                        <label>Merge data condition</label>
                        <InfoIcon />
                    </div>
                    
                    <div className={styles.condition_div}>
                        <div className={styles.condition_style_div}>
                            <div className={styles.corner_left_top}></div>
                            🔗
                            <div className={styles.corner_left_bottom}></div>
                        </div>
                        <div className={styles.condition_inputs_div}>
                            <div className={styles.condition_select}>
                                <SelectSearch 
                                    options={options}
                                    filterOptions={handleFilter}
                                    search
                                />
                            </div>
                            
                            <div className={styles.condition_select}>
                                <SelectSearch 
                                    options={options}
                                    filterOptions={handleFilter}
                                    search
                                />
                            </div>
                        </div>
                        
                    </div>
                </div>}
            </div>
        </ContainerDropdownV2>
    )
}