import React, { useEffect, useRef, useState } from "react";
import {
  ComboboxLabelPositionEnum,
  ComboboxOptionPositionEnum,
} from "../../enums/ComboboxEnum";

const Combobox = ({
  id,
  name,
  value,
  items = [],
  onChange = () => {},
  error = null,
  label = "",
  placeholder = "",
  labelPosition = ComboboxLabelPositionEnum.Top,
  optionPosition = ComboboxOptionPositionEnum.Bottom,
  required = false,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [valueInput, setValueInput] = useState(() => {
    const foundItem = items.find((item) => item._id === value);
    if (foundItem) {
      return foundItem.name;
    }
    return "";
  });
  const [selectedItem, setSelectedItem] = useState(value);
  const [renderedItems, setRenderedItems] = useState(
    JSON.parse(JSON.stringify(items))
  );

  const inputRef = useRef(null);
  const containerRef = useRef(null);

  let inputClass =
    "h-10 w-full text-sm text-black outline-none border border-gray-300 rounded-md pl-3 pr-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors caret-primary";
  if (error) {
    inputClass =
      "h-10 w-full text-sm text-black outline-none border border-red-600 rounded-md pl-3 pr-16 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-colors caret-red-600";
  }

  let itemListClass =
    "absolute z-10 top-[calc(100%_+_4px)] left-0 w-full border overflow-hidden cursor-pointer border-gray-300 rounded-md bg-white shadow-md opacity-0 invisible hidden transition-all";
  let classArrow = "flex items-center justify-center transition-all";
  if (isActive) {
    itemListClass =
      "absolute z-10 top-[calc(100%_+_4px)] left-0 w-full border overflow-hidden cursor-pointer border-gray-300 rounded-md bg-white shadow-md opacity-100 visible block transition-all";
    classArrow = "flex items-center justify-center transition-all rotate-180";
  }

  useEffect(() => {
    const foundItem = items.find((item) => item._id === value);
    if (foundItem) {
      setValueInput(foundItem.name);
    } else {
      setValueInput("");
    }
  }, [value]);

  useEffect(() => {
    if (value) {
      setSelectedItem(value);
    } else {
      setSelectedItem("");
    }

    if (!isActive) {
      const foundedItem = items.find((item) => item._id === value);
      if (foundedItem) {
        setValueInput(foundedItem.name);
      } else {
        setValueInput("");
        setRenderedItems([...items]);
      }
    }
  }, [isActive]);

  useEffect(() => {
    const foundedItem = items.find((item) => item._id === value);
    if (foundedItem) {
      setValueInput(foundedItem.name);
    }
    setRenderedItems(JSON.parse(JSON.stringify(items)));
  }, [items]);

  useEffect(() => {
    const handleClickOutSide = (e) => {
      if (containerRef.current) {
        if (!containerRef.current.contains(e.target)) {
          setIsActive(false);
        }
      }
    };

    window.addEventListener("click", handleClickOutSide);

    return () => {
      window.removeEventListener("click", handleClickOutSide);
    };
  }, []);

  const handleClickInput = () => {
    setRenderedItems([...items]);
    setIsActive(true);
  };

  const handleClickArrow = () => {
    if (isActive) {
      setIsActive(false);
    } else {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      setRenderedItems([...items]);
      setIsActive(true);
    }
  };

  const handleInput = (e) => {
    filterItem(e.target.value);

    setValueInput(e.target.value);
  };

  const filterItem = (valInput) => {
    if (valInput !== undefined && valInput !== null) {
      const newItems = items.filter((item) =>
        item.name.toLowerCase().includes(valInput.toLowerCase())
      );
      setRenderedItems(newItems);
    }
  };

  const handleClickItem = (newVal) => {
    onChange(newVal);
    filterItem(items.find((item) => item._id === newVal)?.name);
    setIsActive(false);
  };

  const handleKeyDown = (e) => {
    const { key } = e;

    if (key !== "Enter" && key !== "Tab" && !isActive) {
      setIsActive(true);
    }

    if (key === "ArrowDown") {
      e.preventDefault();
      if (!selectedItem) {
        setSelectedItem(renderedItems[0]._id);
      } else {
        if (renderedItems.find((item) => item._id === selectedItem)) {
          const idxOfSelectedItem = renderedItems.findIndex(
            (item) => item._id === selectedItem
          );
          const idxOfNextItem = idxOfSelectedItem + 1;
          if (idxOfNextItem < renderedItems.length) {
            setSelectedItem(renderedItems[idxOfNextItem]._id);
          }
        } else {
          setSelectedItem(renderedItems[0]._id);
        }
      }
    } else if (key === "ArrowUp") {
      e.preventDefault();
      if (!selectedItem) {
        setSelectedItem(renderedItems[renderedItems.length - 1]._id);
      } else {
        if (renderedItems.find((item) => item._id === selectedItem)) {
          const idxOfSelectedItem = renderedItems.findIndex(
            (item) => item._id === selectedItem
          );
          const idxOfNextItem = idxOfSelectedItem - 1;
          if (idxOfNextItem >= 0) {
            setSelectedItem(renderedItems[idxOfNextItem]._id);
          }
        } else {
          setSelectedItem(renderedItems[renderedItems.length - 1]._id);
        }
      }
    } else if (key === "Enter" || key === "Tab") {
      if (key === "Enter" && !isActive) {
        setIsActive(true);
      }

      if (selectedItem && isActive) {
        onChange(selectedItem);
        filterItem(items.find((item) => item._id === selectedItem)?.name);
        setIsActive(false);
      }
    }
  };

  return (
    <div ref={containerRef} className="w-full">
      <div
        className={`w-full relative ${
          labelPosition === ComboboxLabelPositionEnum.Left
            ? "flex items-center"
            : ""
        }`}
      >
        {label && (
          <label
            className={`block w-max text-sm whitespace-nowrap ${
              labelPosition === ComboboxLabelPositionEnum.Top ? "pb-1" : ""
            }`}
            htmlFor={id}
          >
            <span className="mr-1">{label}</span>
            {required && <span className="text-red-600">*</span>}
          </label>
        )}
        <input
          ref={inputRef}
          autoComplete="off"
          className={inputClass}
          id={id}
          name={name}
          placeholder={placeholder}
          value={valueInput}
          onInput={handleInput}
          onClick={handleClickInput}
          onKeyDown={handleKeyDown}
        />
        <div
          className="absolute right-[1px] top-[25px] rounded-tr-md rounded-br-md flex items-center justify-center w-10 h-[38px] bg-white text-gray-500 hover:bg-slate-200 transition-colors"
          style={{
            top:
              label && labelPosition === ComboboxLabelPositionEnum.Top
                ? ""
                : "1px",
          }}
          onClick={handleClickArrow}
        >
          <div className={classArrow}>
            <i className="fa-solid fa-chevron-down"></i>
          </div>
        </div>
        <div
          className={itemListClass}
          style={{
            top:
              optionPosition === ComboboxOptionPositionEnum.Top
                ? "unset"
                : null,
            bottom:
              optionPosition === ComboboxOptionPositionEnum.Top
                ? "calc(100% + 4px)"
                : null,
          }}
        >
          <ul className="w-full max-h-[200px] overflow-y-auto">
            {renderedItems.map((item) => {
              let itemClass =
                "group h-10 text-sm w-full flex items-center justify-between px-4 bg-white hover:bg-gray-200 transition-colors relative";
              let iconClass =
                "text-primary group-hover:text-white transition-colors";
              if (item._id === selectedItem) {
                itemClass =
                  "group h-10 text-sm w-full flex items-center justify-between px-4 bg-gray-200 hover:bg-gray-200 transition-colors relative";
              }
              if (item._id === value) {
                itemClass =
                  "group h-10 text-sm w-full flex items-center justify-between text-white px-4 bg-primary/80 hover:bg-primary/80 transition-colors relative";
                iconClass =
                  "text-white group-hover:text-white transition-colors";
              }
             
              return (
                <li
                  key={item._id}
                  className={itemClass}
                  onClick={() => handleClickItem(item._id)}
                >
                  <span>{item.name}</span>
                  {item._id === value && (
                    <span className={iconClass}>
                      <i className="fa-solid fa-check"></i>
                    </span>
                  )}
                </li>
              );
            })}
            {renderedItems.length === 0 && (
              <li className="text-gray-500 h-10 text-sm w-full flex items-center justify-center px-4 bg-white">
                Không có dữ liệu
              </li>
            )}
          </ul>
        </div>
        {error && (
          <label
            className="group absolute top-9 right-11 text-red-600 flex items-center"
            htmlFor={id}
          >
            <i className="fa-solid fa-circle-exclamation"></i>
            <div className="opacity-0 invisible transition-all group-hover:opacity-100 group-hover:visible absolute top-1/2 right-[calc(100%_+_4px)] -translate-y-1/2 w-max text-sm text-white bg-red-600 px-2 py-[2px] rounded-md before:absolute before:top-1/2 before:left-full before:-translate-y-1/2 before:border-t-4 before:border-b-4 before:border-t-transparent before:border-b-transparent before:border-r-4 before:border-r-red-600 before:rotate-180">
              {error}
            </div>
          </label>
        )}
      </div>
    </div>
  );
};

export default Combobox;
