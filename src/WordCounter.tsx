/*global chrome*/
import { useEffect, useState } from "react";
import { getCurrentTab } from "./utils";

export const WordCounter = () => {
  let tabId = 0;
  const [wordCounts, setWordCounts] = useState<Array<number>>([]);

  const getCurrentWordCount = (): number | null => {
    const node = document.getElementById("kix-documentmetrics-widget-content");
    if (!node || !node?.textContent) return null;

    const wordCount = parseInt(node?.textContent, 10);
    console.log(`wc: ${wordCount}`);

    return wordCount;
  };

  const fetchWordCount = async () => {
    while (true) {
      if (tabId !== 0) {
        chrome.scripting
          .executeScript({
            target: { tabId: tabId },
            func: getCurrentWordCount,
          })
          .then((res) => {
            if (res[0].result) {
              setWordCounts([...wordCounts, res[0].result]);
            }
          });
      }
      await new Promise((res) => setTimeout(res, 1000));
    }
  };

  useEffect(() => {
    // Set current tab Id
    (async () => {
      const tab = await getCurrentTab();
      tabId = tab.id ?? 0;
    })();
    fetchWordCount();
  }, []);

  return (
    <div>
      {wordCounts.map((wordCount) => {
        return <h1>{wordCount}</h1>;
      })}
    </div>
  );
};
