import { Flex, Input, Spinner } from "@chakra-ui/react";

import px2vw from "@/theme/utils/px2vw";
import Text from "@/components/Text";
import Select, { ISelectItem } from "@/components/Select";
import { useContractsContext } from "@/context/ContractsContext";
import { ChangeEvent, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import useSelect from "@/hooks/useSelect";
import { formatValue, fromWei, toWei } from "@/utils/common";

import { useDebounce } from "usehooks-ts";
import { TradingData } from "../NFTTradingCard";

export enum ValuesEnum {
  LSC,
  LSLSC,
}

type IData = [BigNumber, BigNumber, BigNumber] & {
  price: BigNumber;
  fee: BigNumber;
  maxLs: BigNumber;
  lsAmount?: string;
};

export enum OperateEnum {
  Split,
  Sell,
}

export interface IProps {
  data: TradingData;
  type: OperateEnum;
  onGetData: (data: any) => void;
}

export default function Index({ data, type, onGetData }: IProps) {
  const [options, setOptions] = useState([
    {
      name: "LSC",
      value: ValuesEnum.LSC,
    },
    {
      name: "LS+LSC",
      value: ValuesEnum.LSLSC,
    },
  ]);
  const [lsValue, setLsValue] = useState("");
  const [current, onSelect] = useSelect(options[0].value);

  const debounceValue = useDebounce(lsValue, 300);

  const { nftMarketContract } = useContractsContext();
  const { data: feeAndPriceData } = useQuery({
    queryKey: ["feeAndPriceData", nftMarketContract?.address],
    queryFn: async ({ queryKey }) => {
      if (!queryKey[1]) return null;
      const res = await getDefaultPriceAndFee();
      onGetData?.({
        ...(res as IData),
        lsAmount: lsValue,
        type: ValuesEnum.LSC,
      });
      return res;
    },
    cacheTime: 0,
    enabled: !!nftMarketContract?.address,
  });

  const {
    mutateAsync,
    data: otherFeeAndPriceData,
    isLoading,
  } = useMutation({
    mutationFn: async (lsAmount: any) => {
      const res = await getPriceAndFee(lsAmount);
      onGetData?.({
        ...(res as IData),
        lsAmount: lsValue,
        type: ValuesEnum.LSLSC,
      });
      return res;
    },
    // mutationKey: "othFeeAndPriceData",
    cacheTime: 0,
  });

  const getPriceAndFee = async (lsAmount: any) => {
    try {
      const res = await nftMarketContract?.getNextPriceAndFee(
        data?.tokenId,
        lsAmount
      );

      return {
        price: res?.price,
        fee: res?.fee,
        maxLs: res?.maxLs,
      };
    } catch (error) {
      console.log("error", error);
    }
  };

  const getDefaultPriceAndFee = async () => {
    try {
      const res = await getPriceAndFee(0);
      return res;
    } catch (error) {}
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const fromWeiMaxLs = fromWei(feeAndPriceData?.maxLs?.toString());
    const lg = fromWeiMaxLs.lt(value);
    if (type === OperateEnum.Split && data.age === 2) {
      setLsValue("0");
      return;
    }
    if (lg) {
      setLsValue(fromWeiMaxLs.toString());
    } else {
      setLsValue(value);
    }
  };

  useEffect(() => {
    if (!debounceValue) return;
    mutateAsync(toWei(debounceValue)?.toString());
  }, [debounceValue, mutateAsync]);

  return (
    <Flex
      width="100%"
      flexDirection="column"
      // height={px2vw(143)}
      padding={px2vw(15)}
      borderRadius="12px"
      border="1px solid"
      borderColor="purple.30"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column">
          {type === OperateEnum.Sell && (
            <>
              {data.age == 1 && data.price <= 500 && (
                <Text type="gradient" fontSize="18px" fontWeight="400">
                  手续费 (6%)
                </Text>
              )}
              {data.age == 1 && data.price > 500 && (
                <Text type="gradient" fontSize="18px" fontWeight="400">
                  手续费 (3%)
                </Text>
              )}

              {data.age == 2 && (
                <Text type="gradient" fontSize="18px" fontWeight="400">
                  手续费 (3%)
                </Text>
              )}

              {data.age == 3 && (
                <Text type="gradient" fontSize="18px" fontWeight="400">
                  手续费 (3%)
                </Text>
              )}
            </>
          )}

          {type === OperateEnum.Split && (
            <>
              {data.age == 1 && (
                <Text type="gradient" fontSize="18px" fontWeight="400">
                  手续费 (3%)
                </Text>
              )}
              {data.age == 2 && (
                <Text type="gradient" fontSize="18px" fontWeight="400">
                  手续费 (0%)
                </Text>
              )}
            </>
          )}

          <Text color="blue.500" fontSize="12px" fontWeight="400">
            选择支付方式
          </Text>
        </Flex>
        <Select
          options={options}
          showArrow={true}
          defaultValue={current}
          onSelectChange={(optionItem) => {
            onSelect(optionItem.value);
            onGetData?.({
              ...data,
              lsAmount: lsValue,
              type: optionItem.value,
            });
          }}
        />
      </Flex>
      {current === ValuesEnum.LSC && (
        <>
          <Text
            marginTop="15px"
            marginBottom="15px"
            color="white.60"
            fontSize="14px"
            alignSelf="center"
          >
            LSC全额支付手续费
          </Text>

          {type === OperateEnum.Sell && (
            <>
              <Text color="white.100" fontSize="16px" alignSelf="end">
                {feeAndPriceData
                  ? fromWei(feeAndPriceData?.fee?.toString())?.toString()
                  : "--"}{" "}
                LSC
              </Text>
            </>
          )}

          {type === OperateEnum.Split && (
            <>
              {data.age == 1 && (
                <Text color="white.100" fontSize="16px" alignSelf="end">
                  {feeAndPriceData
                    ? fromWei(feeAndPriceData?.fee?.toString())?.toString()
                    : "--"}{" "}
                  LSC
                </Text>
              )}

              {data.age == 2 && (
                <Text color="white.100" fontSize="16px" alignSelf="end">
                  0 LSC
                </Text>
              )}
            </>
          )}
        </>
      )}

      {current === ValuesEnum.LSLSC && (
        <>
          <Text
            marginTop="15px"
            marginBottom="15px"
            color="white.60"
            fontSize="13px"
            alignSelf="center"
          >
            输入LS数量（最大{" "}
            {data.age === 2 && type === OperateEnum.Split
              ? 0
              : formatValue(feeAndPriceData?.maxLs?.toString(), true)}
            ）， LSC自动补全
          </Text>

          <Flex width="100%" justifyContent="space-between" alignItems="center">
            <Flex justifyContent="space-between" alignItems="center">
              <Input
                type="number"
                value={lsValue}
                width={px2vw(100)}
                height={px2vw(36)}
                onChange={handleChange}
                borderRadius="10px"
                border="0"
                fontSize="16px"
                textAlign="center"
                background="black.30"
              />

              <Text marginLeft="5px" color="white.100" fontSize="16px">
                LS +
              </Text>
            </Flex>
            <Text color="white.100" fontSize="16px">
              {isLoading ? (
                <Spinner size="xs" />
              ) : (
                <>
                  {type === OperateEnum.Sell && (
                    <>
                      <Text color="white.100" fontSize="16px" alignSelf="end">
                        {formatValue(
                          otherFeeAndPriceData?.fee?.toString(),
                          true
                        )?.toString()}{" "}
                        LSC
                      </Text>
                    </>
                  )}

                  {type === OperateEnum.Split && (
                    <>
                      {data.age == 1 && (
                        <Text color="white.100" fontSize="16px" alignSelf="end">
                          {formatValue(
                            otherFeeAndPriceData?.fee?.toString(),
                            true
                          )?.toString()}{" "}
                          LSC
                        </Text>
                      )}

                      {data.age == 2 && (
                        <Text color="white.100" fontSize="16px" alignSelf="end">
                          0 LSC
                        </Text>
                      )}
                    </>
                  )}
                </>
              )}{" "}
            </Text>
          </Flex>
        </>
      )}
    </Flex>
  );
}
