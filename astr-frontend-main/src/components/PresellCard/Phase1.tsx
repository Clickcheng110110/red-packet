import { Text, Flex, Image, useToast } from "@chakra-ui/react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import px2vw from "@/theme/utils/px2vw";
import presell from "@/assets/images/presell.png";
import { useTranslation } from "next-i18next";
import BaseButton from "../BaseButton";
import { getCountdown, getThousandsValue } from "@/utils/common";
import { useContractsContext } from "@/context/ContractsContext";
import dayjs from "dayjs";
import { ethers } from "ethers";
import { ConfigContext, useConfigContext } from "@/context/ConfigContext";
import useTransaction from "@/hooks/useTransaction";
import { Erc20__factory } from "@/contracts/interface";

function Index() {
  const pid = 0; // 预售的pid，正式环境，预售0
  const toast = useToast();
  const [comingSoon, setComingSoon] = useState(true);
  const { t, i18n } = useTranslation("common");
  const { config } = useConfigContext();
  const { address, signerOrProvider } = useContext(ConfigContext);
  const { idoContract } = useContractsContext();
  const [startTime, setStartTime] = useState<number>(0); // 开始时间
  const [endTime, setEndTime] = useState<number>(0); // 结束时间
  const [isStart, setIsStart] = useState(false); // 是否开始IDO
  const [isEnd, setIsEnd] = useState(false); // 是否结束
  const [uamount, setUamount] = useState<string>(""); // 单份金额
  const [totalShare, setTotalShare] = useState<string>(""); // 剩余份数
  const [availableAmount, setAvailableAmount] = useState<string>(""); // 可领取
  const [claimableAmount, setClaimableAmount] = useState<string>(""); // 待领取
  const [authorizationAmount, setAuthorizationAmount] = useState<any>(0); // 授权额度
  const [usdtBalance, setUsdtBalance] = useState<any>(null); // 用户usdt余额
  const [countDown, setCountDown] = useState<any>(["0", "00", "00", "00"]); // 倒计时的时间显示
  const [isEnough, setIsEnough] = useState(false); // 授权额度是否足够,额度不够为false，足够为true

  const erc20Abi = useMemo(() => {
    if (!signerOrProvider || !config) return null;
    return Erc20__factory.connect(config?.usdt, signerOrProvider);
  }, [signerOrProvider, config]);

  // 授权
  const {
    run: runApprove,
    result: resultApprove,
    loading: loadingApprove,
  } = useTransaction(erc20Abi?.approve, { wait: true });

  // IDO
  // const {
  //   run: runIDO,
  //   result: resultIDO,
  //   loading: loadingIDO,
  // } = useTransaction(idoContract?.ido, { wait: true });

  // withdraw
  const {
    run: runWithdraw,
    result: resultWithdraw,
    loading: loadingWithdraw,
  } = useTransaction(idoContract?.userWithdraw, { wait: true });

  useEffect(() => {
    getInfos();
    getAvailableAmount();
    getClaimableAmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idoContract, address, isStart, isEnd]);

  useEffect(() => {
    getAllowance();
    getUsdtBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [erc20Abi, address, isStart, isEnd]);

  useEffect(() => {
    if (startTime) {
      startCountDown(startTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime]);

  useEffect(() => {
    if (endTime) {
      const res = dayjs.unix(endTime).diff(dayjs());
      setIsEnd(res <= 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endTime]);

  useEffect(() => {
    getAllowance(); // 更新授权额度
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultApprove]);

  useEffect(() => {
    // 更新信息
    getInfos();
    getAvailableAmount();
    getClaimableAmount();
    getAllowance(); // 更新授权额度
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultWithdraw]);

  // 判断授权额度是否足够
  useEffect(() => {
    if (!authorizationAmount || !uamount) return;
    setIsEnough(authorizationAmount?.gte(ethers.BigNumber.from(uamount)));
  }, [authorizationAmount, uamount]);

  // 倒计时设置
  const startCountDown = (time: number) => {
    setInterval(() => {
      const res = getCountdown(time);
      setCountDown(res || ["0", "00", "00", "00"]);
      const isStarts = dayjs.unix(startTime).diff(dayjs());
      setIsStart(isStarts <= 0);
    }, 1000);
  };

  // 获取信息
  const getInfos = async () => {
    try {
      const infos = await idoContract?.idoInfos(pid); // 测试环境，预售5，公售6。正式环境，预售0，公售1
      setComingSoon(infos === undefined || infos === null);
      if (!infos) return;
      setStartTime(infos.startTime.toNumber());
      setEndTime(infos?.endTime.toNumber());
      setUamount(infos?.uamount.toString());
      setTotalShare(infos?.totalShare.toString());
    } catch (err) {
      console.log(err);
    }
  };

  // 获取本期可领
  const getAvailableAmount = async () => {
    if (!address) return;
    try {
      const res = await idoContract?.getAstrAmount(pid, address);
      if (!res) return;
      setAvailableAmount(ethers.utils.formatUnits(res).toString());
    } catch (err) {
      console.log(err);
    }
  };

  // 获取本期待领
  const getClaimableAmount = async () => {
    if (!address) return;
    try {
      const res = await idoContract?.getClaimableAstrAmount(pid, address);
      if (!res) return;
      setClaimableAmount(ethers.utils.formatUnits(res).toString());
    } catch (err) {
      console.log(err);
    }
  };

  // 获取用户账户usdt余额
  const getUsdtBalance = async () => {
    try {
      if (!address) return;
      const res = await erc20Abi?.balanceOf(String(address));
      setUsdtBalance(res);
    } catch (err) {
      console.log(err);
    }
  };

  // 获取授权额度
  const getAllowance = async () => {
    if (!address || !config) return;
    try {
      const res = await erc20Abi?.allowance(address, config?.ido);
      setAuthorizationAmount(res);
    } catch (err) {
      console.log(err);
    }
  };

  // IDO 点击事件
  const IDOClick = () => {
    if (!isStart || Number(totalShare) === 0) return;
    // 需要授权
    if (!isEnough) {
      if (!config) return;
      try {
        runApprove(config.ido, ethers.constants.MaxUint256);
      } catch (err) {
        console.log(err);
      }
    }
    // IDO
    else {
      // 判断用户余额是否足够
      if (usdtBalance.lt(ethers.BigNumber.from(uamount))) {
        toast({
          position: "top",
          title: t("insufficientBalance"),
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }
      try {
        // runIDO(pid);
      } catch (err) {
        console.log(err);
      }
    }
  };

  // withdraw
  const withdrawClick = () => {
    if (Number(claimableAmount) === 0 || !isStart) return;
    try {
      runWithdraw(pid);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex
      w={{ base: "full", lg: "335px" }}
      h={{ base: px2vw(598), lg: "598px" }}
      py={{ base: px2vw(30), lg: "30px" }}
      mb={{ base: px2vw(50), lg: 0 }}
      borderRadius={{ base: px2vw(40), lg: "40px" }}
      opacity={0.9}
      flexDir="column"
      alignItems="center"
      bgColor="black.500"
      boxShadow="0px 4px 40px rgba(6, 16, 43, 0.65)"
      boxSizing="border-box"
      pos="relative"
    >
      {/* title */}
      <Flex
        h={{ base: px2vw(51), lg: "51px" }}
        mb={{ base: px2vw(20), lg: "20px" }}
        flexDir="column"
        alignItems="center"
        fontWeight="400"
        color="white.100"
      >
        <Text
          fontSize={{ base: px2vw(14), lg: "14px" }}
          lineHeight={{ base: px2vw(19), lg: "19px" }}
          opacity={0.6}
        >
          {t("step1")}
        </Text>
        <Text
          fontSize={{ base: px2vw(24), lg: "24px" }}
          lineHeight={{ base: px2vw(32), lg: "32px" }}
          fontWeight="300"
        >
          {t("step1Text")}
        </Text>
      </Flex>
      {/* icon */}
      <Image
        src={presell}
        w={{ base: px2vw(155), lg: "155px" }}
        h={{ base: px2vw(155), lg: "155px" }}
      />
      <Flex
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        pos="absolute"
        bgColor="black.60"
        backdropFilter="blur(2px)"
        m="auto"
        left="0"
        right="0"
        w="max-content"
        py={{ base: px2vw(5), lg: "5px" }}
        px={{ base: px2vw(33), lg: "33px" }}
        top={{ base: px2vw(206), lg: "206px" }}
        borderRadius={{ base: px2vw(20), lg: "20px" }}
        display={comingSoon ? "none" : "block"}
      >
        <Flex
          justifyContent="center"
          fontFamily="PingFang SC"
          fontWeight="500"
          bgClip="text"
          bgGradient="linear-gradient(315deg, #AB8D60 14.58%, #B29466 19.53%, #DBC087 50.65%, #AB8D60 85.31%)"
          fontSize={{ base: px2vw(14), lg: "14px" }}
          lineHeight={{ base: px2vw(20), lg: "20px" }}
        >
          <Text>{t("PublicSaleTips1")}</Text>
          <Text
            fontWeight="400"
            ml="5px"
            display={i18n.language === "en" ? "block" : "none"}
            fontSize={{ base: px2vw(12), lg: "12px" }}
            lineHeight={{ base: px2vw(20), lg: "22px" }}
          >
            {t("PublicSaleTips1.1")}
          </Text>
          <Text>{getThousandsValue(availableAmount)}</Text>
        </Flex>
        <Flex
          justifyContent="center"
          fontFamily="PingFang SC"
          fontWeight="500"
          bgClip="text"
          bgGradient="linear-gradient(315deg, #AB8D60 14.58%, #B29466 19.53%, #DBC087 50.65%, #AB8D60 85.31%)"
          fontSize={{ base: px2vw(14), lg: "14px" }}
          lineHeight={{ base: px2vw(20), lg: "20px" }}
        >
          <Text>{t("PublicSaleTips2")}</Text>
          <Text
            fontWeight="400"
            ml="5px"
            display={i18n.language === "en" ? "block" : "none"}
            fontSize={{ base: px2vw(12), lg: "12px" }}
            lineHeight={{ base: px2vw(20), lg: "22px" }}
          >
            {t("PublicSaleTips2.1")}
          </Text>
          <Text>{getThousandsValue(claimableAmount)}</Text>
        </Flex>
      </Flex>
      {comingSoon ? (
        // coming soon
        <Flex
          mt={{ base: px2vw(60), lg: "60px" }}
          fontSize={{ base: px2vw(36), lg: "36px" }}
          lineHeight={{ base: px2vw(49), lg: "49px" }}
          fontWeight="400"
          flexDir="column"
          alignItems="center"
          bgClip="text"
          bgGradient="linear-gradient(315deg, #AB8D60 14.58%, #B29466 19.53%, #DBC087 50.65%, #AB8D60 85.31%)"
        >
          <Text>{t("comingSoon1")}</Text>
          <Text>{t("comingSoon2")}</Text>
        </Flex>
      ) : (
        <Flex w="full" flexDir="column" alignItems="center">
          {/* 内容 */}
          <Flex
            w="full"
            flexDir="column"
            mt={{ base: px2vw(20), lg: "20px" }}
            px={{ base: px2vw(58), lg: "58px" }}
          >
            {/* 时间范围 */}
            <Flex
              fontFamily="PingFang SC"
              flexDir="column"
              mb={{ base: px2vw(17), lg: "17px" }}
            >
              <Text
                color="white.100"
                fontWeight="400"
                opacity={0.6}
                fontSize={{ base: px2vw(13), lg: "13px" }}
                lineHeight={{ base: px2vw(18), lg: "18px" }}
                mb={{ base: px2vw(8), lg: "8px" }}
              >
                {t("timeRange")}
              </Text>
              <Text
                color="white.100"
                fontWeight="400"
                fontSize={{ base: px2vw(16), lg: "16px" }}
                lineHeight={{ base: px2vw(22), lg: "22px" }}
              >
                {dayjs.unix(startTime || 0).format("YYYY.MM.DD")} -{" "}
                {dayjs.unix(endTime || 0).format("YYYY.MM.DD")}
              </Text>
            </Flex>
            {/* 可用 */}
            <Flex
              fontFamily="PingFang SC"
              justifyContent="flex-start"
              mb={{ base: px2vw(5), lg: "5px" }}
            >
              <Text
                fontWeight="400"
                textStyle="text"
                color="white.60"
                lineHeight={{ base: px2vw(32), lg: "32px" }}
                mr={{ base: px2vw(5), lg: "5px" }}
              >
                {t("use")}
              </Text>
              <Text
                fontSize={{ base: px2vw(22), lg: "22px" }}
                lineHeight={{ base: px2vw(32), lg: "32px" }}
                mr={{ base: px2vw(5), lg: "5px" }}
                color="white.60"
                fontWeight="500"
                bgClip="text"
                bgGradient="linear-gradient(315deg, #AB8D60 14.58%, #B29466 19.53%, #DBC087 50.65%, #AB8D60 85.31%)"
              >
                {uamount &&
                  Number(ethers.utils.formatUnits(uamount).toString()).toFixed(
                    2
                  )}{" "}
                USDT
              </Text>
              <Text
                fontWeight="400"
                textStyle="16"
                color="white.60"
                lineHeight={{ base: px2vw(32), lg: "32px" }}
              >
                {t("to")}
              </Text>
            </Flex>
            {/* 获得 */}
            <Flex
              fontFamily="PingFang SC"
              justifyContent="flex-start"
              alignItems="flex-start"
              mb={{ base: px2vw(10), lg: "10px" }}
            >
              <Text
                fontWeight="400"
                textStyle="text"
                color="white.60"
                lineHeight={{ base: px2vw(32), lg: "32px" }}
                mr={{ base: px2vw(5), lg: "5px" }}
              >
                {t("get")}
              </Text>
              <Text
                fontSize={{ base: px2vw(22), lg: "22px" }}
                lineHeight={{ base: px2vw(32), lg: "32px" }}
                mr={{ base: px2vw(5), lg: "5px" }}
                color="white.60"
                fontWeight="500"
                bgClip="text"
                bgGradient="linear-gradient(315deg, #AB8D60 14.58%, #B29466 19.53%, #DBC087 50.65%, #AB8D60 85.31%)"
              >
                {getThousandsValue(10000)} LSC
              </Text>
            </Flex>
            {/* Tips */}
            <Flex mb={{ base: px2vw(28), lg: "28px" }}>
              <Text
                fontFamily="PingFang SC"
                fontWeight="400"
                color="white.100"
                opacity={0.6}
                fontSize={{ base: px2vw(13), lg: "13px" }}
                lineHeight={{ base: px2vw(18), lg: "18px" }}
              >
                {t("tips1")}
              </Text>
              {totalShare && (
                <Flex
                  fontFamily="PingFang SC"
                  fontWeight="400"
                  color="white.100"
                  opacity={0.6}
                  fontSize={{ base: px2vw(13), lg: "13px" }}
                  lineHeight={{ base: px2vw(18), lg: "18px" }}
                >
                  <Text mx={{ base: px2vw(3), lg: "3px" }}>,</Text>
                  <Text>{t("remaining")}</Text>
                  <Text mx={{ base: px2vw(3), lg: "3px" }}>{totalShare}</Text>
                  <Text>{t("unit")}</Text>
                </Flex>
              )}
            </Flex>
            {/* 倒计时 */}
            <Flex
              h={{ base: px2vw(32), lg: "32px" }}
              mb={{ base: px2vw(30), lg: "30px" }}
            >
              <Flex
                fontWeight="400"
                color="white.100"
                alignItems="flex-end"
                display={isStart ? "none" : "flex"}
                fontSize={{ base: px2vw(32), lg: "32px" }}
                lineHeight={{ base: px2vw(32), lg: "32px" }}
              >
                <Text>{countDown[0]}</Text>
                <Text
                  fontSize={{ base: px2vw(20), lg: "20px" }}
                  lineHeight={{ base: px2vw(20), lg: "28px" }}
                  mr={{ base: px2vw(5), lg: "5px" }}
                >
                  d:
                </Text>
                <Text>{countDown[1]}</Text>
                <Text
                  fontSize={{ base: px2vw(20), lg: "20px" }}
                  lineHeight={{ base: px2vw(20), lg: "28px" }}
                  mr={{ base: px2vw(5), lg: "5px" }}
                >
                  h:
                </Text>
                <Text>{countDown[2]}</Text>
                <Text
                  fontSize={{ base: px2vw(20), lg: "20px" }}
                  lineHeight={{ base: px2vw(20), lg: "28px" }}
                  mr={{ base: px2vw(5), lg: "5px" }}
                >
                  m:
                </Text>
                <Text>{countDown[3]}</Text>
                <Text
                  fontSize={{ base: px2vw(20), lg: "20px" }}
                  lineHeight={{ base: px2vw(20), lg: "28px" }}
                >
                  s
                </Text>
              </Flex>
            </Flex>
          </Flex>
          {/* 按钮 */}
          <Flex>
            <BaseButton
              display={isEnd || Number(totalShare) === 0 ? "none" : "block"}
              isLoading={loadingApprove}
              w={{ base: "full", lg: "109px" }}
              mr={{ base: px2vw(25), lg: "25px" }}
              onClick={() => IDOClick()}
              isDisabled={!isStart || !(Number(totalShare) > 0)}
            >
              <Flex flexDir="column">
                {!isEnough && (
                  <Text
                    fontFamily="PingFang SC"
                    fontWeight="600"
                    fontSize={{ base: px2vw(12), lg: "12px" }}
                    lineHeight={{ base: px2vw(16), lg: "16px" }}
                  >
                    {t("approve")}
                  </Text>
                )}
                <Text
                  fontWeight="700"
                  letterSpacing="0.2rem"
                  fontSize={{ base: px2vw(18), lg: "18px" }}
                  lineHeight={{ base: px2vw(20), lg: "20px" }}
                >
                  IDO
                </Text>
              </Flex>
            </BaseButton>
            <BaseButton
              w={{ base: "full", lg: "150px" }}
              isLoading={loadingWithdraw}
              isDisabled={!(Number(claimableAmount) > 0) || !isStart}
              onClick={() => withdrawClick()}
            >
              <Flex flexDir="column">
                <Text
                  fontWeight="700"
                  fontSize={{ base: px2vw(18), lg: "18px" }}
                  lineHeight={{ base: px2vw(20), lg: "20px" }}
                >
                  Withdraw
                </Text>
              </Flex>
            </BaseButton>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
export default Index;
