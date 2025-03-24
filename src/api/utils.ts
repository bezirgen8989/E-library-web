export const getFilter = (option: any) => {
  if (option?.sorting) {
    delete option.sorting;
  }
  if (!option) {
    return "";
  }
  const filter = Object.entries(option)
    .map(([key, val]) => {
      if (val) {
        if (typeof val !== "object") {
          return `${key}=${val}`;
        } else {
          return Object.entries(val)
            .map(([key2, val2]) => {
              if (val2) {
                if (typeof val2 === "object") {
                  return Object.entries(val2)
                    .map(([key3, val3]) => {
                      if (val3 && typeof val3 === "object") {
                        if (val3) {
                          return `${key}[${key2}][${key3}]=${val3}`;
                        } else {
                          return `${key}[${key2}][${key3}]=${val3}`;
                        }
                      }
                    })
                    .join("&");
                } else {
                  return `${key}[${key2}]=${val2}`;
                }
              }
            })
            .join("&");
        }
      }
    })
    .join("&");

  return filter;
};

export const getSort = ({ field = "", direction = "asc" }) => {
  if (!field) return "";
  return `sort=${direction === "desc" ? `-` : ""}${field}`;
};

export const generateUrlParams = (option: any) => {
  if (!option) {
    return "";
  }

  const sorting = option?.sorting ? getSort(option.sorting) : "";
  const filter = getFilter(option);

  let params = "";

  if (filter.length > 0) {
    params = sorting ? `?${filter}&${sorting}` : `?${filter}`;
  } else if (!filter.length && sorting) {
    params = `?${sorting}`;
  }

  return params;
};
