import type { TStorySubmission } from "../../../shared";
import { get } from 'svelte/store'

import { setStory, storyState, usePregeneratedStory } from '../stores/story.svelte';
import { parseOutEvents, statementEventsToStatementPeps } from "../../../shared/storyparser";

/**
 * Opens a websocket connection to the server and requests a story. Websockets are opened as a GET request
 * which we use to pass the initial story form fields along.
 * 
 * Event listeners are used to await different events from the server, all of them are rather self explanatory.
 * @param submission 
 * @returns 
 */
export const fetchStory = async (submission: TStorySubmission): Promise<void> => {
  const url = new URL(`${import.meta.env.VITE_API_SERVER_WS}${import.meta.env.VITE_PROMPT_URL_WS}`);
  url.searchParams.append('kingdom', submission.kingdom);
  url.searchParams.append('people', JSON.stringify(submission.people));
  console.log(`url: ${url}`);
  
  if (get(usePregeneratedStory)) {
    const events = parseOutEvents(pregenStories[2].story);
    const statementPePs = statementEventsToStatementPeps(events);
    setStory(statementPePs);
    storyState.set('READY');
    return;
  }

  return new Promise((resolve, reject) => {
    let inProgress = false;

    // Connect to the WebSocket
    const ws = new WebSocket(url.toString());

    ws.addEventListener('open', () => {
      console.log('WebSocket connection opened.');
    });

    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      const { type, payload } = data;

      switch (type) {
        case 'generating_story':
          inProgress = true;
          storyState.set('LOADING');
          console.log('Story generation in progress');
          break;

        case 'story_line':
          inProgress = false;
          storyState.set('READY');
          console.log('Story received:', payload.story);
          setStory(payload);
          resolve();

          break;

        case 'error':
          inProgress = false;
          console.error('Error generating story:', payload.error);
          reject(payload.error);
          break;

        default:
          console.error('Unknown message type:', type);
          break;
      }
    });

    ws.addEventListener('close', () => {
      console.log('WebSocket connection closed.');
      if (inProgress) {
        reject(new Error('WebSocket connection closed while story generation was in progress.'));
      }
    });

    ws.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      reject(error);
    });
  });
};

// Pregenerated stories for testing with. Set the array index up above on `const events = parseOutEvents(pregenStories[2].story);` to change which one is used.
const pregenStories = [{"story": "Henry, the king of Arcadia, had been ruling for many years, but his health was failing (Henry 🤒). His wife, Queen Beth, was beside him day and night, hoping for his recovery (Beth 👀 Henry 🤒).\n\nMartin, the king's older son, saw this as an opportunity to take the throne and started plotting with his advisor, Gregory, to remove his father from power (Martin 🤔 Gregory 🤔 Henry 👑).\n\nShiloh, the bishop of Arcadia, knew about Martin's plan and decided to inform the king (Shiloh 💬 Henry).\n\nThe king was furious and ordered Martin's arrest (Henry ⚔️ Martin). However, Queen Beth pleaded with her husband to spare their son's life (Beth 💬 Henry).\n\nMeanwhile, Darleen, the king's younger daughter, was secretly in love with Gregory (Darleen ❤️ Gregory). She wanted to help Martin take the throne, so she asked Gregory for his help (Darleen 🤔 Gregory 🤔 Martin 👑).\n\nGregory agreed to help Darleen by giving Martin valuable information that would help him overthrow his father (Gregory 🤝 Darleen 🤔 Martin 👑).\n\nMartin launched a rebellion against his father, and after a bloody battle, he emerged victorious (Martin ⚔️ Henry) and was crowned the new king of Arcadia (Martin 👑).\n\nHowever, Martin soon realized that being a king was not as easy as he had thought. He faced many challenges, including rebellions, plagues, and droughts. But with the help of Gregory, he managed to keep the kingdom together (Martin 🤝 Gregory 👑 Kingdom).\n\nAs years passed, Martin became a wise and just ruler, and Darleen became his trusted advisor (Martin 🤝 Darleen 👑). The kingdom of Arcadia flourished under his rule, and the people revered him as one of the greatest kings in their history."},
{"story": "Henry had been king of Arcadia for twenty years when he contracted a deadly illness. The queen, Beth, was worried about his health and spent countless hours by his side. (Beth 👀 Henry 🤒)\n\nMartin, the older son, was away at war when he received news of his father's failing health. He returned home to find his father bedridden and his mother distraught. (Martin 🚶‍♂️ Henry 🤒)\n\nMeanwhile, Shiloh, the bishop of Arcadia, had grown restless with Henry's leadership. He believed that the king was no longer fit to rule and began rallying support amongst the people. (Shiloh 📢)\n\nGregory, Henry's advisor, urged Martin to take up arms against Shiloh and his supporters. The young prince was hesitant to start a civil war but ultimately agreed to his father's wishes. (Gregory 🗣️ Martin ⚔️ Shiloh)\n\nAs Martin prepared for battle, Darleen, the younger daughter, approached him with a proposal. She suggested that they should overthrow their father and take control of the kingdom together. (Darleen 🤝 Martin 🤔)\n\nMartin was outraged by his sister's suggestion and refused to participate in such a treacherous act. Instead, he focused on defeating Bishop Shiloh and restoring peace to Arcadia. (Martin 🙅‍♂️ Darleen)\n\nAfter a long and bloody fight, Martin emerged victorious. He was crowned king of Arcadia, and Shiloh was exiled from the kingdom. (Martin 👑)\n\nAlthough Martin had won the throne, he knew that his family's political struggles were far from over. As he sat on the throne, he wondered who would be the next one to betray him."},
{"story": "The kingdom of Arcadia had been ruled by King Henry for many years. He had a loyal queen, Beth, and two children, Martin and Darleen. Shiloh was the Bishop of the kingdom, and Gregory was Henry's most trusted advisor.\n\nHenry had grown old and weary, so he called upon his advisors to discuss who would rule after him (Henry 🗣️ Gregory, Shiloh).\n\nWhile they were discussing, Martin and Darleen were plotting to murder each other to ensure that one of them became the next ruler of Arcadia (Martin 🗡️ Darleen) (Darleen 🗡️ Martin).\n\nBeth was aware of her children's intentions and knew that she needed to prepare herself for the future. She began to build alliances with key members of the court (Beth 🤔 Gregory, Shiloh) (Beth 🤔 Martin).\n\nMartin believed that he would be the one to take the throne, but he needed more support. He reached out to Tim, a neighboring lord, to form an alliance (Martin 🤔 Tim).\n\nMeanwhile, Darleen had also made an alliance with a powerful sorcerer to help her gain the upper hand in the fight for the crown (Darleen 💍 Sorcerer).\n\nAs tensions grew within the kingdom, Gregory proposed a solution - a marriage between Martin and Darleen, which would unite the kingdom and end the conflict (Gregory 🤔 Martin 💍 Darleen).\n\nHowever, Martin and Darleen were not willing to compromise. Martin hired an assassin to kill Darleen, while Darleen used her sorcerer to curse Martin (Martin 🗡️ Darleen) (Darleen 🧙 Martin).\n\nIn the chaos that ensued, Shiloh took control of the kingdom, declaring himself the new ruler (Shiloh 👑). Beth was left to mourn the loss of her family and the destruction of the kingdom she had worked so hard to protect."},
{"story": "As tensions grew within the kingdom, Gregory proposed a solution - a marriage between Martin and Darleen, which would unite the kingdom and end the conflict (Gregory 🤔 Martin 💍 Darleen).\n\nHowever, Martin and Darleen were not willing to compromise. Martin hired an assassin to kill Darleen, while Darleen used her sorcerer to curse Martin (Martin 🗡️ Darleen) (Darleen 🧙 Martin).\n\nIn the chaos that ensued, Shiloh took control of the kingdom, declaring himself the new ruler (Shiloh 👑). Beth was left to mourn the loss of her family and the destruction of the kingdom she had worked so hard to protect."}
];