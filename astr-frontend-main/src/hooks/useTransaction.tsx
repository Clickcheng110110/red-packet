import InfoBox, { toastOption } from "@/components/TransToast";
import { portalErrorTranslation } from "@/utils/common";
import { useState } from "react";
import { toast } from "react-toastify";

interface Option<Params> {
  args?: Params[];
  wait?: boolean;
}

function useTransaction<Params = any, Response = any>(
  method: any,
  { args = [], wait = false }: Option<Params>
) {
  const [result, setResult] = useState<Response>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(false);

  const callMethod = async (...fnArgs: any[]) => {
    setLoading(true);
    setError(null);
    // console.log('fnArgs', fnArgs);

    try {
      const res: any = await method(...[...args, ...fnArgs]);
      wait && (await res.wait());
      setResult(res);
    } catch (e) {
      toast(
        (props) => {
          return <InfoBox type="error" {...props} />;
        },
        {
          ...toastOption,
          data: portalErrorTranslation(e),
        }
      );
      setError(e);
      throw new Error("Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return { run: callMethod, result, error, loading };
}

export default useTransaction;
