import type { TRelationship, TPerson, TStorySubmission } from "../../../shared";

export const fetchStory = async (submission: TStorySubmission): Promise<string> => {
  console.log(`got ${JSON.stringify(pregenCharacters)}`);
  console.log(`comparing to ${JSON.stringify(pregenCharacters)}`);
  if (JSON.stringify(pregenCharacters) === JSON.stringify(submission)) return pregenStories[0];

  const url = `${import.meta.env.VITE_API_SERVER}${import.meta.env.VITE_PROMPT_URL}`;
    console.log(`url: ${url}`);
    const fetchOptions = {
      method: 'POST',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(submission)
    };
    const response = await fetch(url, fetchOptions);
    const result = await response.json();
    console.log(result);
    return result.story as string;
}

const pregenStories = [`{
    "story": "Henry, the king of Arcadia, had been ruling for many years, but his health was failing (Henry 🤒). His wife, Queen Beth, was beside him day and night, hoping for his recovery (Beth 👀 Henry 🤒).\n\nMartin, the king's older son, saw this as an opportunity to take the throne and started plotting with his advisor, Gregory, to remove his father from power (Martin 🤔 Gregory 🤔 Henry 👑).\n\nShiloh, the bishop of Arcadia, knew about Martin's plan and decided to inform the king (Shiloh 💬 Henry).\n\nThe king was furious and ordered Martin's arrest (Henry ⚔️ Martin). However, Queen Beth pleaded with her husband to spare their son's life (Beth 💬 Henry).\n\nMeanwhile, Darleen, the king's younger daughter, was secretly in love with Gregory (Darleen ❤️ Gregory). She wanted to help Martin take the throne, so she asked Gregory for his help (Darleen 🤔 Gregory 🤔 Martin 👑).\n\nGregory agreed to help Darleen by giving Martin valuable information that would help him overthrow his father (Gregory 🤝 Darleen 🤔 Martin 👑).\n\nMartin launched a rebellion against his father, and after a bloody battle, he emerged victorious (Martin ⚔️ Henry) and was crowned the new king of Arcadia (Martin 👑).\n\nHowever, Martin soon realized that being a king was not as easy as he had thought. He faced many challenges, including rebellions, plagues, and droughts. But with the help of Gregory, he managed to keep the kingdom together (Martin 🤝 Gregory 👑 Kingdom).\n\nAs years passed, Martin became a wise and just ruler, and Darleen became his trusted advisor (Martin 🤝 Darleen 👑). The kingdom of Arcadia flourished under his rule, and the people revered him as one of the greatest kings in their history."
}`,
`{
  "story": "Henry had been king of Arcadia for twenty years when he contracted a deadly illness. The queen, Beth, was worried about his health and spent countless hours by his side. (Beth 👀 Henry 🤒)\n\nMartin, the older son, was away at war when he received news of his father's failing health. He returned home to find his father bedridden and his mother distraught. (Martin 🚶‍♂️ Henry 🤒)\n\nMeanwhile, Shiloh, the bishop of Arcadia, had grown restless with Henry's leadership. He believed that the king was no longer fit to rule and began rallying support amongst the people. (Shiloh 📢)\n\nGregory, Henry's advisor, urged Martin to take up arms against Shiloh and his supporters. The young prince was hesitant to start a civil war but ultimately agreed to his father's wishes. (Gregory 🗣️ Martin ⚔️ Shiloh)\n\nAs Martin prepared for battle, Darleen, the younger daughter, approached him with a proposal. She suggested that they should overthrow their father and take control of the kingdom together. (Darleen 🤝 Martin 🤔)\n\nMartin was outraged by his sister's suggestion and refused to participate in such a treacherous act. Instead, he focused on defeating Bishop Shiloh and restoring peace to Arcadia. (Martin 🙅‍♂️ Darleen)\n\nAfter a long and bloody fight, Martin emerged victorious. He was crowned king of Arcadia, and Shiloh was exiled from the kingdom. (Martin 👑)\n\nAlthough Martin had won the throne, he knew that his family's political struggles were far from over. As he sat on the throne, he wondered who would be the next one to betray him."
}`,
`{
  "story": "Henry, the king of Arcadia, was growing old and frail (Henry 🤒). His children, Martin and Darleen, were both ambitious and eager to succeed him. Martin was the older of the two and therefore assumed he would be the next in line for the throne (Martin 👑).\n\nHowever, Beth, the queen, had other plans. She knew that Martin lacked the necessary temperament to rule the kingdom and believed that Darleen would be a more suitable ruler (Beth 🤔 Darleen 👑 Martin).\n\nShiloh, the bishop, also had his own plans for the kingdom. He wanted to increase the power of the church and saw an opportunity to do so by supporting Darleen's claim to the throne (Shiloh 🤔 Darleen 👑).\n\nGregory, the king's trusted advisor, was worried about the power struggles within the royal family and the possible repercussions it could have on the kingdom (Gregory 😟).\n\nAs tensions mounted, Martin became more desperate to secure his position as the heir to the throne. He hired an assassin to kill Darleen (Martin 🗡️ Darleen).\n\nBeth, having anticipated Martin's move, had already taken precautionary measures. She had Darleen marry Gregory's son, thereby solidifying her claim to the throne (Beth 💍 Darleen 👑).\n\nWhen Martin's failed assassination attempt became known, the king banished him from the kingdom (Henry 🔨 Martin).\n\nShiloh rallied the support of the church behind Darleen and helped her ascend to the throne. As queen, Darleen proved to be a wise and just ruler, much to the relief of Gregory and the people of Arcadia (Darleen 👑)."
}`
];

const pregenCharacters = {"kingdom":"Arcadia",
"people":[
    {"id":0,"name":"Henry","relationship":"King"},
    {"id":1,"name":"Beth","relationship":"Queen"},
    {"id":2,"name":"Martin","relationship":"Older Son"},
    {"id":3,"name":"Shiloh","relationship":"Bishop"},
    {"id":4,"name":"Gregory","relationship":"Advisor"},
    {"id":5,"name":"Darleen","relationship":"Younger Daughter"}]};