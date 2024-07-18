/*global chrome*/
import { useEffect, useState } from "react";
import { getCurrentTab } from "./utils";

export const WordCounter = () => {
  let tabId = 0;
  const [wordCounts, setWordCounts] = useState<Array<number>>([5]);

  // Fetch current word count from doc
  const getCurrentWordCount = (): number | null => {
    const node = document.getElementById("kix-documentmetrics-widget-content");
    if (!node || !node?.textContent) return null;

    const wordCount = parseInt(node?.textContent, 10);

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
            const newCount = res[0].result;
            if (newCount) {
              setWordCounts((wordCounts) => {
                // Only update wordCount if it is a new value
                return wordCounts[wordCounts.length - 1] !== newCount
                  ? [...wordCounts, newCount]
                  : wordCounts;
              });
            }
          });
      }
      // Delay before fetching again
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
      <h2>word length: {wordCounts.length}</h2>
      {wordCounts.map((wordCount) => {
        return <h1>{wordCount}</h1>;
      })}
    </div>
  );
};
