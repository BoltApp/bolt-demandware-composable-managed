import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

type BoltHeaderScriptTags = {
  id: string;
  publishableKey: string;
  src: string;
};

export const BoltHeader = (props) => {
  const { boltConfig, ...rest } = props;
  const defaultTags: BoltHeaderScriptTags[] = [];
  const [boltScriptTags, setBoltScriptTags] = useState(defaultTags);

  useEffect(() => {
    if (boltConfig?.boltMultiPublishableKey) {
      let boltConfigVal = [
        {
          id: "bolt-connect",
          publishableKey: boltConfig.boltMultiPublishableKey,
          src: boltConfig.boltCdnUrl + "/connect.js",
        },
      ];
      setBoltScriptTags(boltConfigVal);
    } else {
      setBoltScriptTags(defaultTags);
    }
  }, [boltConfig]);

  return (
    <Helmet>
      {boltScriptTags &&
        boltScriptTags.map((boltScriptTag) => (
          <script
            type="text/javascript"
            key={boltScriptTag.id}
            id={boltScriptTag.id}
            data-publishable-key={boltScriptTag.publishableKey}
            src={boltScriptTag.src}
          ></script>
        ))}
    </Helmet>
  );
};
