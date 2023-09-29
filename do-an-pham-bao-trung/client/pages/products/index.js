import React, { useEffect, useState } from "react";
import Head from "next/head";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductCardLoading from "../../components/ProductCard/ProductCardLoading";
import Gallery from "../../components/Gallery/Gallery";
import InputField from "../../components/InputField/InputField";
import Combobox from "../../components/Combobox/Combobox";
import Button from "../../components/Button/Button";
import Image from "next/image";

import baseApi from "../../api/BaseApi";
import { TypeStyle } from "../../enums/InputFieldEnum";
import { ComboboxLabelPositionEnum } from "../../enums/ComboboxEnum";
import { useDispatch } from "react-redux";
import { triggerScrollTop } from "../../slices/scrollSlice";
import { useRouter } from "next/router";

import NoDataImage from "../../assets/images/no-records.svg";
import { stringifyQuery } from "next/dist/server/server-route-utils";

const SORT_OPTIONS = [
  {
    _id: "name|1",
    name: "Tên sản phẩm tăng dần",
  },
  {
    _id: "name|-1",
    name: "Tên sản phẩm giảm dần",
  },
  {
    _id: "price|1",
    name: "Giá tăng dần",
  },
  {
    _id: "price|-1",
    name: "Giá giảm dần",
  },
];

const Products = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedSortOption, setSelectedSortOption] = useState("price|-1");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState("16");
  const [searchText, setSearchText] = useState("");
  const [productType, setProductType] = useState([]);
  const [productTypeSelect, setProductTypeSelect] = useState("all");
  const [searchFunc, setSearchFunc] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [queryTags, setQueryTags] = useState({});

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    getInitData();
    baseApi.get(`/productType`).then(({ data: { data } }) => {
      setProductType(
        data.map((x) => ({ ...x, filter: convertObjToArrayObjGroup(x.filter) }))
      );
    });
  }, []);

  const handleChangeSearchText = (e) => {
    setSearchText(e.target.value);
    clearTimeout(searchFunc);
    setSearchFunc(
      setTimeout(() => {
        getPaging(generateQuery({ SearchText: e.target.value }));
      }, 500)
    );
  };

  const handleChangeSort = (e) => {
    getPaging(generateQuery({ Sort: e, PageIndex: 1 }));
    setPageIndex(1);
    setSelectedSortOption(e);
  };

  const handleChangePageIndex = (newPageIdx) => {
    setPageIndex(newPageIdx);
    getPaging(generateQuery({ PageIndex: newPageIdx }));
  };

  const handleChangePageSize = (newPageSize) => {
    setPageSize(newPageSize);
    setPageIndex(1);
    getPaging(generateQuery({ PageSize: newPageSize, PageIndex: 1 }));
  };

  const getInitData = async () => {
    const query = router.query;
    const apiQuery = {
      PageIndex: 1,
    };

    try {
      getPaging(generateQuery(apiQuery));
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoadMore = async () => {
    if (products.length < totalRecords) {
      const newPageIndex = pageIndex + 1;
      setPageIndex(newPageIndex);
      getPaging(generateQuery({ PageIndex: newPageIndex }), true);
    }
  };

  const getPaging = async (query = "", isLoadMore = false) => {
    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    try {
      const res = await baseApi.get(`/products/query?${query}`);
      if (isLoadMore === true) {
        setProducts([...products, ...res.data.data.pageData]);
      } else {
        setProducts([...res.data.data.pageData]);
      }
      setTotalRecords(res.data.data.totalRecords);
      setIsLoading(false);
      setIsLoadingMore(false);
      if (isLoadMore === false) {
        dispatch(triggerScrollTop());
      }
    } catch (error) {
      setIsLoading(false);
      setIsLoadingMore(false);
      console.log(error);
    }
  };
  const handleChangeProductType = (e) => {
    setProductTypeSelect(e);
    getPaging(generateQuery({ productType: e, PageIndex: 1 }));
    setPageIndex(1);
    setQueryTags({})
  };
  const generateQuery = ({
    SearchText = null,
    PageSize = null,
    PageIndex = null,
    Sort = null,
    productType = null,
  }) => {
    const query = `pageSize=${PageSize || pageSize}&pageIndex=${
      PageIndex || pageIndex
    }&searchText=${SearchText !== null ? SearchText : searchText}&sort=${
      Sort || selectedSortOption
    }${productType && "&productType=" + productType}`;
    return query;
  };

  const filterTags = productType.find(
    (x) => x._id === productTypeSelect
  )?.filter;

  const handleChangeQuerryTags = (e) => {
    const [key, value] = e.split(":");
    setQueryTags(pre => {
      const query = { ...queryTags, ...{ [key]: value } };
      const strQuery = Object.keys(query).map(x => `${x}=${query[x]}`).join('&')
      getPaging(generateQuery({ PageIndex: 1 })+'&'+strQuery);
      setPageIndex(1);
      return query;
    });
   
  };
  return (
    <div>
      <Head>
        <title>Sản phẩm</title>
        <link rel="icon" href="/icon.ico" />
      </Head>

      <main className="w-full">
        <div className="container mx-auto">
          <div className="w-full py-3 mt-6 bg-white transition-all duration-300">
            <div className="container mx-auto flex items-center justify-between">
              <div className="w-96">
                <InputField
                  id="search-text"
                  name="search-text"
                  placeholder="Tìm kiếm theo tên sản phẩm ..."
                  typeStyle={TypeStyle.Normal}
                  startIcon={
                    <div>
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                  }
                  value={searchText}
                  onInput={handleChangeSearchText}
                />
              </div>
              <div className="flex items-center gap-x-3">
                <div className="w-72">
                  <Combobox
                    id="sort-option"
                    name="sort-option"
                    items={SORT_OPTIONS}
                    value={selectedSortOption}
                    label="Sắp xếp theo"
                    labelPosition={ComboboxLabelPositionEnum.Left}
                    onChange={handleChangeSort}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-x-3">
                <div className="w-72">
                  <Combobox
                    id="sort-option"
                    name="sort-option"
                    items={productType}
                    value={productTypeSelect}
                    label="Loại"
                    labelPosition={ComboboxLabelPositionEnum.Left}
                    onChange={handleChangeProductType}
                  />
                </div>

                {filterTags &&
                  Object.keys(filterTags).map((key,index) => (
                    <div className="w-72">
                      <Combobox
                        key={index}
                        id="sort-option"
                        name="sort-option"
                        items={filterTags[key].map((x) => ({
                          _id: `${key}:${x}`,
                          name: x,
                        }))}
                        label={key}
                        onChange={handleChangeQuerryTags}
                        labelPosition={ComboboxLabelPositionEnum.Left}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="mt-6">
            {isLoading ? (
              <Gallery>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(
                  (productIdx) => (
                    <ProductCardLoading key={productIdx} />
                  )
                )}
              </Gallery>
            ) : products.length > 0 ? (
              <Gallery>
                {products.map((product) => (
                  <ProductCard key={product._id} {...product} />
                ))}
              </Gallery>
            ) : (
              <div>
                <div className="relative w-[500px] h-[500px] mx-auto">
                  <Image
                    src={NoDataImage}
                    objectFit="contain"
                    objectPosition="center"
                    layout="fill"
                  />
                  <div className="text-4xl text-gray-500 absolute top-7 left-1/2 -translate-x-1/2 w-full text-center bg-white">
                    Không tìm thấy sản phẩm!
                  </div>
                </div>
              </div>
            )}
            {products.length > 0 && products.length < totalRecords && (
              <div>
                <Button
                  className="mx-auto mt-10"
                  style={{
                    height: 44,
                    borderRadius: 6,
                  }}
                  isLoading={isLoadingMore}
                  onClick={handleLoadMore}
                >
                  Tải thêm
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const convertObjToArrayObjGroup = (originalList = []) => {
  const groupKeys = {};
  originalList.forEach(({ column, value }) => {
    if (!groupKeys.hasOwnProperty(column)) groupKeys[column] = [];
    groupKeys[column].push(value);
  });

  return groupKeys;
};

export default Products;
