import { useState, useEffect, useRef, useCallback } from "react";

// ══════════════════════════════════════════════════════════════════════════════
//  PALETTE — Portugal flag official + Porto regional
// ══════════════════════════════════════════════════════════════════════════════
const C = {
  green:"#046A38", red:"#DA291C", gold:"#C8A527",
  azulejo:"#1E4D8C", terra:"#B8511A", ochre:"#A87820",
  portWine:"#6E1A34", douro:"#1A3A68", granite:"#5A5450",
  teal:"#1A6B6B",
  bg:"#F2EDD8", surface:"#EAE2C8", border:"#D2C8A8",
  softGold:"#F0E4B0", softGreen:"#E4F0E8", softRed:"#F8E8E4", softBlue:"#E4EAF8",
  ink:"#1A150A", muted:"#6B5C40", faint:"#9A8C70", onDark:"#F8F2E4",
};

// ══════════════════════════════════════════════════════════════════════════════
//  PHASE 1 DATA
// ══════════════════════════════════════════════════════════════════════════════
const ALPHABET_DATA = [
  {letter:"A",name:"á",     ipa:"/a/ · /ɐ/",              example:"amor",        meaning:"love",        tip:"Open 'ah' when stressed; softer schwa /ɐ/ when unstressed"},
  {letter:"B",name:"bê",    ipa:"/b/",                    example:"bem",         meaning:"well/good",   tip:"Same as English B"},
  {letter:"C",name:"cê",    ipa:"/s/ or /k/",             example:"Cristo",      meaning:"Christ",      tip:'"S" before E/I; "K" before A/O/U'},
  {letter:"D",name:"dê",    ipa:"/d/",                    example:"Deus",        meaning:"God",         tip:"Softer than English D — never the 'j' used in Brazilian Portuguese"},
  {letter:"E",name:"ê",     ipa:"/e/ · /ɛ/ · /ɨ/",       example:"evangelho",   meaning:"gospel",      tip:"⚠️ Often nearly SILENT at word endings in pt-PT!"},
  {letter:"F",name:"éfe",   ipa:"/f/",                    example:"fé",          meaning:"faith",       tip:"Exactly like English F"},
  {letter:"G",name:"gê",    ipa:"/ɡ/ or /ʒ/",             example:"graça",       meaning:"grace",       tip:"Hard G before A/O/U; soft 'zh' before E/I"},
  {letter:"H",name:"agá",   ipa:"(always silent)",        example:"hora",        meaning:"hour",        tip:"⚠️ H is ALWAYS silent — hora = 'OH-rah'"},
  {letter:"I",name:"i",     ipa:"/i/",                    example:"Igreja",      meaning:"church",      tip:"Always a clear 'ee' — never changes"},
  {letter:"J",name:"jota",  ipa:"/ʒ/",                    example:"Jesus",       meaning:"Jesus",       tip:"The 's' in 'measure' — 'Zheh-ZOOSH' in pt-PT"},
  {letter:"K",name:"capa",  ipa:"/k/",                    example:"quilómetro",  meaning:"kilometre",   tip:"Rare — mostly in foreign words"},
  {letter:"L",name:"ele",   ipa:"/l/",                    example:"luz",         meaning:"light",       tip:"Clear L at start; darker L at syllable end"},
  {letter:"M",name:"eme",   ipa:"/m/ (nasalizes)",        example:"missão",      meaning:"mission",     tip:"At syllable end, M nasalizes the vowel before it"},
  {letter:"N",name:"ene",   ipa:"/n/ (nasalizes)",        example:"nome",        meaning:"name",        tip:"Like M — nasalizes the preceding vowel"},
  {letter:"O",name:"ó",     ipa:"/o/ · /ɔ/ · /u/",       example:"oração",      meaning:"prayer",      tip:"Unstressed O often sounds like 'oo' — unique to pt-PT!"},
  {letter:"P",name:"pê",    ipa:"/p/",                    example:"paz",         meaning:"peace",       tip:"Like English P"},
  {letter:"Q",name:"quê",   ipa:"/k/",                    example:"que",         meaning:"that/what",   tip:"Always followed by U (silent): QUE = 'keh'"},
  {letter:"R",name:"erre",  ipa:"/ɾ/ or /ʁ/",             example:"restauração", meaning:"restoration", tip:"Middle of word: soft tap. Start or RR: deep guttural!"},
  {letter:"S",name:"esse",  ipa:"/s/ or /ʃ/",             example:"Santos",      meaning:"Saints",      tip:"⚠️ Before consonants/at syllable end: the famous 'sh' hiss!"},
  {letter:"T",name:"tê",    ipa:"/t/",                    example:"testemunho",  meaning:"testimony",   tip:"Like English T — never 'ch' like Brazilian"},
  {letter:"U",name:"u",     ipa:"/u/",                    example:"unidade",     meaning:"unity",       tip:"Always clear 'oo' like in moon"},
  {letter:"V",name:"vê",    ipa:"/v/",                    example:"verdade",     meaning:"truth",       tip:"Like English V"},
  {letter:"W",name:"dáblio",ipa:"/v/ or /w/",             example:"watt",        meaning:"watt",        tip:"Rare — foreign words only"},
  {letter:"X",name:"xis",   ipa:"/ʃ/ · /ks/ · /s/ · /z/",example:"exemplo",     meaning:"example",     tip:"⚠️ Usually 'sh' in pt-PT — the trickiest letter!"},
  {letter:"Y",name:"ípsilon",ipa:"/i/",                   example:"yoga",        meaning:"yoga",        tip:"Rare — borrowed words only"},
  {letter:"Z",name:"zê",    ipa:"/z/ or /ʃ/",             example:"zelo",        meaning:"zeal",        tip:"Z at start; 'sh' at syllable end in pt-PT"},
];
const SPECIAL_SOUNDS = [
  {combo:"LH",ipa:"/ʎ/",  example:"filho", meaning:"son",      tip:"Palatal L — like 'lli' in million.",      why:"família, trabalho, ilha...", clr:C.green},
  {combo:"NH",ipa:"/ɲ/",  example:"senhor",meaning:"sir/lord", tip:"Palatal N — like 'ny' in canyon.",        why:"Senhor, senhora, manhã...", clr:C.azulejo},
  {combo:"ÃO",ipa:"/ɐ̃w̃/",example:"irmão", meaning:"brother",  tip:"Nasal 'ow' — no English equivalent!",     why:"irmão, missão, coração...",clr:C.terra},
  {combo:"ÃE",ipa:"/ɐ̃j̃/",example:"mãe",   meaning:"mother",   tip:"Nasal 'ay' — the word for mother!",       why:"mãe, pães, capitães...",   clr:C.terra},
  {combo:"CH",ipa:"/ʃ/",  example:"chave", meaning:"key",      tip:"Always 'sh' — chave = 'SHAH-veh'",        why:"chave, chegada, cheio...", clr:C.ochre},
  {combo:"RR",ipa:"/ʁ/",  example:"carro", meaning:"car",      tip:"Guttural — from the back of the throat",  why:"carro, terra, word-start R",clr:C.portWine},
  {combo:"OU",ipa:"/o/",  example:"ouvir", meaning:"to hear",  tip:"In pt-PT, OU = plain 'oh', not 'ow'",     why:"ouvir, outro, outubro...", clr:C.douro},
];
const PHRASE_CATEGORIES = [
  {id:"greetings",label:"Saudações",  sublabel:"Greetings",   color:C.green,    phrases:[
    {pt:"Bom dia!",                                en:"Good morning!",                       wbw:"Good day!",                          note:"Until roughly noon"},
    {pt:"Boa tarde!",                              en:"Good afternoon!",                     wbw:"Good afternoon!",                    note:"Noon until sunset"},
    {pt:"Boa noite!",                              en:"Good evening / Good night!",          wbw:"Good night!",                        note:"Evening greeting and farewell"},
    {pt:"Olá! Como está?",                         en:"Hello! How are you?",                 wbw:"Hello! How are-you?",                note:"Formal 'you' — always use with strangers"},
    {pt:"Tudo bem, obrigada.",                     en:"All is well, thank you.",             wbw:"All well, obliged.",                 note:"Obrigada = feminine; obrigado = masculine"},
    {pt:"Muito prazer em conhecê-la!",             en:"It's a pleasure to meet you!",        wbw:"Much pleasure in knowing-her!",      note:"-la for a woman; -lo for a man"},
    {pt:"Até logo!",                               en:"See you soon!",                       wbw:"Until soon!",                        note:"Friendly farewell"},
    {pt:"Até amanhã!",                             en:"See you tomorrow!",                   wbw:"Until tomorrow!",                    note:"When you'll visit again"},
  ]},
  {id:"intro",label:"Apresentação",  sublabel:"Introduction", color:C.azulejo,  phrases:[
    {pt:"O meu nome é Irmã Bennett.",              en:"My name is Sister Bennett.",          wbw:"The my name is Sister Bennett.",     note:"European Portuguese uses article before 'meu/minha'"},
    {pt:"Sou missionária de A Igreja de Jesus Cristo dos Santos dos Últimos Dias.", en:"I am a missionary for The Church of Jesus Christ of Latter-day Saints.", wbw:"I-am missionary of The Church of Jesus Christ of-the Saints of-the Last Days.", note:"Full Church name in Portuguese"},
    {pt:"Servimos na Missão Portugal Porto.",       en:"We serve in the Portugal Porto Mission.", wbw:"We-serve in-the Mission Portugal Porto.", note:"Introduce your specific mission"},
    {pt:"Posso partilhar uma mensagem consigo?",   en:"May I share a message with you?",     wbw:"Can-I share a message with-you?",    note:"'consigo' = formal 'with you' — use at the door"},
    {pt:"Temos uma mensagem importante para si.",  en:"We have an important message for you.", wbw:"We-have a message important for you.", note:"'si' = formal 'you'"},
    {pt:"Somos enviadas pelo Senhor Jesus Cristo.",en:"We are sent by the Lord Jesus Christ.", wbw:"We-are sent by-the Lord Jesus Christ.", note:"Establishes divine authority"},
  ]},
  {id:"teaching",label:"Ensino",     sublabel:"Teaching",     color:C.terra,    phrases:[
    {pt:"Queremos falar sobre Jesus Cristo e o Seu evangelho.", en:"We would like to speak about Jesus Christ and His gospel.", wbw:"We-want speak about Jesus Christ and the His gospel.", note:"Standard lesson opener"},
    {pt:"O Livro de Mórmon é outra testemunha de Jesus Cristo.", en:"The Book of Mormon is another testament of Jesus Christ.", wbw:"The Book of Mormon is another witness of Jesus Christ.", note:"Introducing the Book of Mormon"},
    {pt:"A família é ordenada por Deus.",          en:"The family is ordained of God.",      wbw:"The family is ordained by God.",     note:"Central theme of every discussion"},
    {pt:"Sei que Deus é o nosso Pai Celestial.",   en:"I know that God is our Heavenly Father.", wbw:"I-know that God is the our Father Heavenly.", note:"Bearing testimony"},
    {pt:"Tem alguma pergunta?",                    en:"Do you have any questions?",          wbw:"Have you some question?",            note:"Use often — invite engagement"},
    {pt:"O Profeta José Smith restaurou a Igreja de Cristo.", en:"The Prophet Joseph Smith restored the Church of Christ.", wbw:"The Prophet Joseph Smith restored the Church of Christ.", note:"The Restoration lesson"},
    {pt:"Convidamo-la a ser batizada.",             en:"We invite you to be baptized.",       wbw:"We-invite-her to be baptized.",      note:"-la for a woman; -lo for a man"},
  ]},
  {id:"prayer",label:"Oração",       sublabel:"Prayer",        color:C.portWine, phrases:[
    {pt:"Podemos começar com uma oração?",          en:"Can we begin with a prayer?",              wbw:"Can-we begin with a prayer?",               note:"Opening every lesson with prayer"},
    {pt:"Podemos terminar com uma oração?",         en:"Can we end with a prayer?",                wbw:"Can-we finish with a prayer?",              note:"Closing every lesson"},
    {pt:"Gostaria de oferecer uma oração?",         en:"Would you like to offer a prayer?",        wbw:"Would-you-like to offer a prayer?",         note:"Inviting an investigator to pray — powerful"},
    {pt:"Querido Pai Celestial,",                   en:"Dear Heavenly Father,",                    wbw:"Dear Father Celestial,",                    note:"Universal opening — always these words"},
    {pt:"Estamos gratas por poder estar aqui hoje.",en:"We are grateful to be able to be here today.", wbw:"We-are grateful for can be here today.", note:"Expressing gratitude for the visit"},
    {pt:"Somos gratas por todas as Tuas bênçãos.",  en:"We are grateful for all Thy blessings.",   wbw:"We-are grateful for all the Thy blessings.",note:"'gratas' = feminine plural"},
    {pt:"Somos gratas pelo Teu Filho Jesus Cristo.", en:"We are grateful for Thy Son Jesus Christ.", wbw:"We-are grateful for-the Thy Son Jesus Christ.", note:"Central gratitude in every prayer"},
    {pt:"Somos gratas pelo Espírito Santo.",        en:"We are grateful for the Holy Spirit.",     wbw:"We-are grateful for-the Spirit Holy.",      note:"Acknowledging the Spirit's presence"},
    {pt:"Somos gratas pelo Livro de Mórmon.",       en:"We are grateful for the Book of Mormon.",  wbw:"We-are grateful for-the Book of Mormon.",   note:"When leaving a copy"},
    {pt:"Por favor, abençoa esta família.",         en:"Please bless this family.",                wbw:"For please, bless this family.",            note:"Personalise: abençoa [name]"},
    {pt:"Abençoa os que estão doentes.",            en:"Bless those who are sick.",                wbw:"Bless the that are sick.",                  note:"When someone in the home is unwell"},
    {pt:"Ajuda-nos a compreender Teu evangelho.",   en:"Help us to understand Thy gospel.",        wbw:"Help-us to understand Thy gospel.",         note:"Asking for spiritual understanding"},
    {pt:"Abre o coração desta família para receber a Tua mensagem.", en:"Open the heart of this family to receive Thy message.", wbw:"Open the heart of-this family to receive the Thy message.", note:"Powerful prayer for investigators"},
    {pt:"Ajuda-nos a sentir o Teu Espírito Santo.", en:"Help us to feel Thy Holy Spirit.",         wbw:"Help-us to feel the Thy Spirit Holy.",      note:"Inviting the Spirit into the lesson"},
    {pt:"Guia-nos enquanto estudamos as Tuas escrituras.", en:"Guide us as we study Thy scriptures.", wbw:"Guide-us while we-study the Thy scriptures.", note:"Opening a scripture study session"},
    {pt:"Abençoa o nosso presidente de missão.",    en:"Bless our mission president.",             wbw:"Bless the our president of mission.",       note:"Naming mission leadership in prayer"},
    {pt:"Abençoa os nossos líderes da Igreja.",     en:"Bless our Church leaders.",                wbw:"Bless the our leaders of-the Church.",      note:"General leadership — prophet, apostles"},
    {pt:"Ajuda-nos a ser dignas do Teu Espírito.",  en:"Help us to be worthy of Thy Spirit.",      wbw:"Help-us to be worthy of-the Thy Spirit.",   note:"'dignas' = worthy, feminine plural"},
    {pt:"Perdoa-nos os nossos pecados.",            en:"Forgive us our sins.",                     wbw:"Forgive-us the our sins.",                  note:"Confession and repentance in prayer"},
    {pt:"Sabemos que és o nosso Pai Celestial.",    en:"We know that Thou art our Heavenly Father.", wbw:"We-know that you-are the our Father Celestial.", note:"Affirming relationship with God"},
    {pt:"Pedimos isto em nome de Jesus Cristo.",    en:"We ask this in the name of Jesus Christ.", wbw:"We-ask this in name of Jesus Christ.",      note:"Always before Amen — never omit"},
    {pt:"Amém.",                                    en:"Amen.",                                    wbw:"Amen.",                                     note:"Ah-MAYN — the closing word, said by all"},
  ]},
];
const MILESTONES = [
  {days:1,  label:"First Step!",      icon:"🌱",clr:C.green},
  {days:3,  label:"3-Day Flame",      icon:"🔥",clr:C.terra},
  {days:7,  label:"One Full Week",    icon:"🔥🔥",clr:C.ochre},
  {days:14, label:"Two Weeks Strong", icon:"⭐",clr:C.gold},
  {days:30, label:"One Month!",       icon:"🌟",clr:C.gold},
  {days:60, label:"Two Months!",      icon:"💎",clr:C.azulejo},
  {days:90, label:"Mission Ready!",   icon:"🏆",clr:C.portWine},
  {days:120,label:"Elite Learner!",   icon:"👑",clr:C.douro},
];

// ══════════════════════════════════════════════════════════════════════════════
//  PHASE 2 DATA
// ══════════════════════════════════════════════════════════════════════════════
const CULTURE_SECTIONS = [
  {id:"porto",   icon:"🌉",label:"Porto — A Cidade",       sublabel:"The City",             color:C.douro,    bgColor:"#EEF2FA",
   tagline:"UNESCO World Heritage city on the River Douro",
   body:`Porto is Portugal's second-largest city and one of the oldest cities in Europe. Built on steep granite hillsides above the River Douro, its historic Ribeira district — a tangle of narrow streets, colourful houses painted in ochre, rust, teal and faded lilac — was inscribed as a UNESCO World Heritage Site in 1996. The city's name literally gave Portugal its name: "Portucale," meaning "port" or "harbour."\n\nThe iconic Dom Luís I Bridge, completed in 1886 by a student of Gustave Eiffel, connects Porto to Vila Nova de Gaia across the Douro — and from its upper deck you look back over terracotta rooftops that define the Porto skyline. São Bento Station, right in the city centre, is one of the great azulejo masterpieces: its entrance hall is covered in 20,000 hand-painted tiles depicting scenes from Portuguese history.`,
   vocab:[{pt:"a cidade",en:"the city"},{pt:"o rio",en:"the river"},{pt:"a ponte",en:"the bridge"},{pt:"o bairro",en:"the neighbourhood"},{pt:"a colina",en:"the hill"},{pt:"o porto",en:"the port/harbour"},{pt:"a estação",en:"the station"},{pt:"o azulejo",en:"the tile"},{pt:"o telhado",en:"the roof"},{pt:"a janela",en:"the window"}],
   missionTip:"When people ask where you are from, say: \"Sou do Canadá.\" They will love telling you about Porto. Genuine curiosity about their city opens hearts."},
  {id:"azulejos",icon:"🔷",label:"Azulejos",               sublabel:"The Tiles of Portugal", color:C.azulejo,  bgColor:"#EEF2FA",
   tagline:"Portugal's painted ceramic soul — stories told in blue and white",
   body:`Azulejos are tin-glazed ceramic tiles that cover the façades of churches, train stations, palaces, and ordinary homes across Portugal. The word comes from the Arabic "az-zulayj" meaning "polished stone." They arrived in Portugal via the Moorish tradition in the 15th century and became uniquely Portuguese over the next 500 years.\n\nThe classic blue-and-white pattern you will see everywhere came from the 17th century. Every major church, school, and public building in Porto is covered in them. The exterior of the Igreja do Carmo is entirely tiled in a single breathtaking blue-and-white scene covering the entire side wall.\n\nFor missionaries: azulejos often depict religious scenes — the life of Christ, patron saints, biblical stories. They are a natural conversation starter about faith.`,
   vocab:[{pt:"o azulejo",en:"the tile"},{pt:"a parede",en:"the wall"},{pt:"a fachada",en:"the façade"},{pt:"a Igreja",en:"the church"},{pt:"azul",en:"blue"},{pt:"branco",en:"white"},{pt:"pintado",en:"painted"},{pt:"a história",en:"the story/history"},{pt:"bonito",en:"beautiful"},{pt:"antigo",en:"ancient/old"}],
   missionTip:"\"Estes azulejos são lindos — pode dizer-me a sua história?\" (These tiles are beautiful — can you tell me their story?) is a wonderful opener with elderly neighbours."},
  {id:"fado",    icon:"🎸",label:"Fado",                   sublabel:"The Soul of Portugal",  color:C.portWine, bgColor:"#F8EEF0",
   tagline:"UNESCO-protected music of longing, fate, and saudade",
   body:`Fado (meaning "fate" in Portuguese) is Portugal's most distinctive music — a UNESCO Intangible Cultural Heritage. It is the sound of the Portuguese soul: mournful, beautiful, and deeply human.\n\nThe essential concept of fado is "saudade" — an untranslatable Portuguese word describing a melancholic longing for something or someone loved and lost. It is one of the most frequently used words in the Portuguese language and captures something fundamental about how the Portuguese people see the world.\n\nFor missionaries: understanding saudade helps you understand your investigators. Many Portuguese people feel a deep spiritual longing they cannot name — a homesickness for something beyond this world. That longing is a door.`,
   vocab:[{pt:"o fado",en:"fado (fate/music)"},{pt:"a saudade",en:"longing/yearning"},{pt:"a música",en:"the music"},{pt:"a guitarra",en:"the guitar"},{pt:"a cantora",en:"the female singer"},{pt:"a alma",en:"the soul"},{pt:"sentir",en:"to feel"},{pt:"o amor",en:"love"},{pt:"a esperança",en:"hope"},{pt:"a saudade de casa",en:"homesickness"}],
   missionTip:"\"A saudade que sentimos por Deus é real\" — The longing we feel for God is real. Saudade gives you a bridge from Portuguese culture directly to the gospel's message of divine love."},
  {id:"saojoao", icon:"🔥",label:"Festa de São João",     sublabel:"Porto's Greatest Festival",color:C.terra,  bgColor:"#FAF0EA",
   tagline:"June 23rd — the night Porto takes to the streets",
   body:`The Festa de São João on the night of June 23rd is Porto's biggest and most beloved celebration. The entire city pours into the streets for a night of music, fireworks, bonfires, and joyful chaos unlike any festival elsewhere in the world.\n\nThe festival's most iconic traditions: people hit each other on the head with plastic hammers or bunches of leeks — bringing good luck rather than offence. Thousands of paper lanterns are released into the night sky above the Douro. At midnight, "saltar a fogueira" — leaping over a bonfire — is performed for good luck.\n\nSardines grilled on open street fires fill the air with their unforgettable aroma. Locals eat them with bread and green wine while folk music plays all night.`,
   vocab:[{pt:"a festa",en:"the festival"},{pt:"a fogueira",en:"the bonfire"},{pt:"saltar",en:"to jump/leap"},{pt:"o balão",en:"the balloon/lantern"},{pt:"a sardinha",en:"the sardine"},{pt:"o martelo",en:"the hammer"},{pt:"o alho-porro",en:"the leek"},{pt:"a sorte",en:"luck"},{pt:"a noite",en:"the night"},{pt:"o fogo de artifício",en:"fireworks"}],
   missionTip:"If you serve through June, you will experience São João. Participating shows love for the culture. It is a natural time to talk about light, hope, and celebration — all gospel themes."},
  {id:"food",    icon:"🥐",label:"Comida Portuguesa",     sublabel:"Food Culture",           color:C.ochre,   bgColor:"#FAF4E8",
   tagline:"Bacalhau 365 ways — and pastéis de nata born in a monastery",
   body:`Portuguese food is one of Europe's great unsung cuisines — humble, flavourful, and rooted in history. The national ingredient is bacalhau (salted cod), cured and dried for centuries to last long sea voyages. The Portuguese say there are 365 ways to cook bacalhau — one for every day of the year.\n\nThe most famous Portuguese pastry is the pastel de nata (custard tart) — invented by monks at the Jerónimos Monastery in Belém in the 18th century. In Porto, the local favourite is the francesinha — a monumental sandwich of meat, ham, and sausage drowned in a spicy tomato-beer sauce with a fried egg on top.\n\nMeals in Portugal are social, slow, and generous. Being invited to eat with a family is one of the great privileges of missionary service.`,
   vocab:[{pt:"o bacalhau",en:"salted cod"},{pt:"o pastel de nata",en:"custard tart"},{pt:"a francesinha",en:"Porto sandwich"},{pt:"o pão",en:"bread"},{pt:"o vinho",en:"wine"},{pt:"o azeite",en:"olive oil"},{pt:"delicioso",en:"delicious"},{pt:"a receita",en:"the recipe"},{pt:"a família",en:"the family"},{pt:"partilhar",en:"to share"}],
   missionTip:"Accepting food is accepting love in Portuguese culture. \"Está delicioso, obrigada!\" (It's delicious, thank you!) will delight any family you visit."},
  {id:"stories", icon:"📖",label:"Contos Populares",      sublabel:"Folk Stories",           color:C.green,   bgColor:"#E8F4EC",
   tagline:"Stories every Portuguese child knows by heart",
   body:`Portuguese folk stories are woven with faith, humility, and the miraculous — centuries of Catholic tradition braided with older Moorish and Roman roots. They reflect the Portuguese character: resilient, spiritual, and deeply human.\n\nThe most beloved is O Galo de Barcelos (The Rooster of Barcelos) — a tale of faith, justice, and miracle that gave Portugal its national symbol. A pilgrim is wrongly condemned to hang. He appeals to the judge over a roast cockerel, saying it will crow to prove his innocence. At the moment of hanging, the dead rooster crows and the man is freed. The ceramic cockerel is now sold in every tourist shop — but its story is known by every Portuguese person.\n\nOther beloved tales: stories of the Sereia (the Portuguese mermaid), the Mouras Encantadas (enchanted Moorish princesses trapped in fountains), and legends of Dom Afonso Henriques, Portugal's founding king.`,
   vocab:[{pt:"o conto",en:"the tale/story"},{pt:"o galo",en:"the rooster"},{pt:"o milagre",en:"the miracle"},{pt:"a fé",en:"faith"},{pt:"a sereia",en:"the mermaid"},{pt:"o rei",en:"the king"},{pt:"a lenda",en:"the legend"},{pt:"encantado",en:"enchanted"},{pt:"a esperança",en:"hope"},{pt:"a justiça",en:"justice"}],
   missionTip:"O Galo de Barcelos is a perfect conversation starter: \"Conhece a história do Galo de Barcelos? Fala sobre fé e milagres — como o evangelho que ensinamos.\""},
];

const READER_TEXTS = [
  {id:"galo",       category:"folk",      icon:"🐓",level:"Beginner",    levelColor:C.green,
   title:"O Galo de Barcelos", subtitle:"The Rooster of Barcelos — Portugal's most beloved legend",
   segments:[
     {pt:"Há muitos anos, um peregrino passou pela cidade de Barcelos.",       en:"There many years, a pilgrim passed through-the city of Barcelos.",          note:"'Há muitos anos' = There are many years = Long ago"},
     {pt:"Ele estava a caminho de Santiago de Compostela.",                    en:"He was on-the road toward Santiago de Compostela.",                          note:"'a caminho de' = on the road to"},
     {pt:"Um crime havia sido cometido na cidade.",                            en:"A crime had been committed in-the city.",                                     note:"'havia sido' = past perfect — 'had been'"},
     {pt:"O peregrino foi acusado injustamente do crime.",                     en:"The pilgrim was accused unjustly of-the crime.",                              note:"'-mente' endings = English -ly"},
     {pt:"O juiz condenou-o à morte.",                                         en:"The judge condemned-him to-the death.",                                       note:"'-o' attached to verb = 'him'"},
     {pt:"O peregrino suplicou ao juiz: \"Este galo assado vai cantar para provar a minha inocência!\"", en:"The pilgrim pleaded to-the judge: 'This rooster roasted will-sing to prove the my innocence!'", note:"'vai cantar' = is going to sing (ir + infinitive = future)"},
     {pt:"No momento da execução, o galo morto cantou.",                       en:"In-the moment of-the execution, the rooster dead crowed.",                   note:"Adjective follows noun: 'galo morto' = dead rooster"},
     {pt:"O juiz correu para libertar o peregrino inocente.",                  en:"The judge ran to free the pilgrim innocent.",                                 note:"'para' + infinitive = 'in order to'"},
     {pt:"Desde então, o Galo de Barcelos é o símbolo de Portugal.",          en:"Since then, the Rooster of Barcelos is the symbol of Portugal.",              note:"'Desde então' = Since then"},
     {pt:"É um símbolo de fé, justiça e milagre.",                            en:"It-is a symbol of faith, justice and miracle.",                               note:"No pronoun needed — verb ending shows 'it'"},
   ]},
  {id:"pmg1",       category:"gospel",    icon:"📘",level:"Intermediate",  levelColor:C.azulejo,
   title:"Pregai o Meu Evangelho — Cap. 1", subtitle:"Preach My Gospel — Chapter 1 (selected verses)",
   segments:[
     {pt:"O seu objetivo como missionária é convidar outras pessoas a virem a Cristo.", en:"The your objective as missionary is to-invite other people to come to Christ.", note:"'O seu' = The your — article before possessives"},
     {pt:"Você faz isso ajudando-as a receber o evangelho restaurado.",        en:"You do that helping-them to receive the gospel restored.",                    note:"'-as' = them (feminine plural) attached to the verb"},
     {pt:"O Pai Celestial ama todos os Seus filhos e quer que regressem a Ele.", en:"The Father Celestial loves all the His children and wants that they-return to Him.", note:"'quer que' + subjunctive — 'wants that they return'"},
     {pt:"O amor de Deus é a força que impulsiona o trabalho missionário.",    en:"The love of God is the force that drives the work missionary.",               note:"Adjective 'missionário' follows noun 'trabalho'"},
     {pt:"Jesus Cristo é o centro de tudo o que ensinamos.",                  en:"Jesus Christ is the centre of all the that we-teach.",                        note:"'tudo o que' = everything that"},
     {pt:"O Livro de Mórmon é outra testemunha de Jesus Cristo.",             en:"The Book of Mormon is another witness of Jesus Christ.",                      note:"A phrase you will say every day as a missionary"},
     {pt:"A Restauração cumpriu as promessas de Deus.",                       en:"The Restoration fulfilled the promises of God.",                              note:"'cumpriu' = fulfilled — past tense, third person"},
     {pt:"Convido-vos a ler, refletir e perguntar a Deus em oração.",         en:"I-invite-you (plural) to read, reflect and ask to God in prayer.",            note:"'Convido-vos' = I invite you all — formal plural"},
   ]},
  {id:"2ne3120",    category:"scripture", icon:"📜",level:"Intermediate",  levelColor:C.terra,
   title:"2 Néfi 31:20", subtitle:"Book of Mormon — 2 Nephi 31:20",
   segments:[
     {pt:"Portanto, amados irmãos e irmãs, ide com perseverança na vereda que leva à vida eterna,", en:"Therefore, beloved brothers and sisters, go with perseverance in-the path that leads to-the life eternal,", note:"'amados' = beloved. 'vereda' = path"},
     {pt:"depois de haverdes entrado pela estreita porta,",                    en:"after having-you entered through-the narrow gate,",                           note:"'haverdes entrado' = perfect infinitive plural"},
     {pt:"tendo recebido o Santo Espírito, o qual leva ao Pai;",              en:"having received the Holy Spirit, the which leads to-the Father;",             note:"'o qual' = which (referring to masculine noun)"},
     {pt:"assim, pressionai avante com firmeza em Cristo,",                   en:"thus, press-ye forward with firmness in Christ,",                             note:"'pressionai' = imperative plural command form"},
     {pt:"tendo um brilho perfeito de esperança e amor a Deus e a todos os homens.", en:"having a brightness perfect of hope and love to God and to all the men.", note:"'brilho' = brightness. 'esperança' = hope"},
     {pt:"Se, portanto, pressionardes avante, festejando a palavra de Cristo,", en:"If, therefore, you-press forward, feasting on-the word of Christ,",          note:"'festejando' = feasting/celebrating"},
     {pt:"e perseverardes até ao fim, eis que assim diz o Pai:",              en:"and you-persevere until the end, behold thus says the Father:",               note:"'até ao fim' = unto the end. 'eis que' = behold"},
     {pt:"\"Tereis a vida eterna.\"",                                          en:"'You-will-have the life eternal.'",                                           note:"'Tereis' = you will have — future of 'ter'"},
   ]},
  {id:"joao316",    category:"scripture", icon:"📜",level:"Beginner",    levelColor:C.green,
   title:"João 3:16", subtitle:"Bible — John 3:16 in European Portuguese",
   segments:[
     {pt:"Porque Deus amou o mundo de tal maneira",                           en:"Because God loved the world in such manner",                                  note:"'de tal maneira' = in such a way — a key phrase"},
     {pt:"que deu o seu Filho Unigénito,",                                    en:"that he-gave the his Son Only-Begotten,",                                     note:"'Unigénito' = Only Begotten. 'o seu' = the his"},
     {pt:"para que todo o que nele crê não pereça,",                          en:"so-that all the that in-him believes not perish,",                            note:"'para que' = so that. 'nele' = in him"},
     {pt:"mas tenha a vida eterna.",                                           en:"but may-have the life eternal.",                                              note:"'tenha' = subjunctive of 'ter' — used after 'para que'"},
   ]},
  {id:"oracaomanha",category:"daily",     icon:"🌅",level:"Beginner",    levelColor:C.green,
   title:"Oração da Manhã", subtitle:"A Morning Prayer — for Sister Bennett's daily use",
   segments:[
     {pt:"Querido Pai Celestial,",                                             en:"Dear Father Celestial,",                                                     note:"Universal opening of every Latter-day Saint prayer"},
     {pt:"Sou grata por este novo dia e pelas Tuas bênçãos.",                 en:"I-am grateful for this new day and for-the Thy blessings.",                  note:"'Sou grata' = I am grateful (feminine)"},
     {pt:"Ajuda-me a ser uma boa missionária hoje.",                          en:"Help-me to be a good missionary today.",                                      note:"'Ajuda-me' = help me — imperative + pronoun"},
     {pt:"Guia os meus passos e as minhas palavras.",                         en:"Guide the my steps and the my words.",                                        note:"'os meus' / 'as minhas' — article + possessive"},
     {pt:"Que o Teu Espírito Santo esteja sempre comigo.",                    en:"That the Thy Holy Spirit be always with-me.",                                 note:"'esteja' = subjunctive of 'estar' — used in wishes"},
     {pt:"Peço isto em nome de Jesus Cristo, Amém.",                          en:"I-ask this in name of Jesus Christ, Amen.",                                   note:"Universal closing of every prayer"},
   ]},
];

// ══════════════════════════════════════════════════════════════════════════════
//  PHASE 3 — VOCABULARY DATA (8 categories × 12 words)
// ══════════════════════════════════════════════════════════════════════════════
const VOCAB_CATS = [
  { id:"numbers",   label:"Números",           sublabel:"Numbers & Counting",    icon:"🔢", color:C.green,
    words:[
      {pt:"zero",en:"zero"},{pt:"um",en:"one"},{pt:"dois",en:"two"},{pt:"três",en:"three"},
      {pt:"quatro",en:"four"},{pt:"cinco",en:"five"},{pt:"seis",en:"six"},{pt:"sete",en:"seven"},
      {pt:"oito",en:"eight"},{pt:"nove",en:"nine"},{pt:"dez",en:"ten"},{pt:"onze",en:"eleven"},
      {pt:"doze",en:"twelve"},{pt:"treze",en:"thirteen"},{pt:"catorze",en:"fourteen"},{pt:"quinze",en:"fifteen"},
      {pt:"dezasseis",en:"sixteen"},{pt:"dezassete",en:"seventeen"},{pt:"dezoito",en:"eighteen"},
      {pt:"dezanove",en:"nineteen"},{pt:"vinte",en:"twenty"},{pt:"trinta",en:"thirty"},
      {pt:"quarenta",en:"forty"},{pt:"cinquenta",en:"fifty"},{pt:"sessenta",en:"sixty"},
      {pt:"setenta",en:"seventy"},{pt:"oitenta",en:"eighty"},{pt:"noventa",en:"ninety"},
      {pt:"cem",en:"one hundred"},
    ]
  },
  { id:"time",      label:"Dias e Tempo",       sublabel:"Days, Months & Time",   icon:"📅", color:C.azulejo,
    words:[
      {pt:"segunda-feira",en:"Monday"},{pt:"terça-feira",en:"Tuesday"},{pt:"quarta-feira",en:"Wednesday"},
      {pt:"quinta-feira",en:"Thursday"},{pt:"sexta-feira",en:"Friday"},{pt:"sábado",en:"Saturday"},
      {pt:"domingo",en:"Sunday"},{pt:"hoje",en:"today"},{pt:"amanhã",en:"tomorrow"},
      {pt:"ontem",en:"yesterday"},{pt:"manhã",en:"morning"},{pt:"tarde",en:"afternoon"},
      {pt:"noite",en:"evening/night"},{pt:"semana",en:"week"},{pt:"fim de semana",en:"weekend"},
      {pt:"mês",en:"month"},{pt:"ano",en:"year"},{pt:"janeiro",en:"January"},
      {pt:"fevereiro",en:"February"},{pt:"março",en:"March"},{pt:"abril",en:"April"},
      {pt:"maio",en:"May"},{pt:"junho",en:"June"},{pt:"julho",en:"July"},
      {pt:"agosto",en:"August"},{pt:"setembro",en:"September"},{pt:"outubro",en:"October"},
      {pt:"novembro",en:"November"},{pt:"dezembro",en:"December"},
    ]
  },
  { id:"food",      label:"Comida e Bebida",    sublabel:"Food & Drink",          icon:"🥐", color:C.terra,
    words:[
      {pt:"o pão",en:"the bread"},{pt:"o café",en:"the coffee"},{pt:"a água",en:"the water"},
      {pt:"o bacalhau",en:"the salted cod"},{pt:"o pastel de nata",en:"the custard tart"},
      {pt:"o jantar",en:"the dinner"},{pt:"o almoço",en:"the lunch"},{pt:"o pequeno-almoço",en:"the breakfast"},
      {pt:"delicioso",en:"delicious"},{pt:"obrigada",en:"thank you (fem.)"},{pt:"a conta",en:"the bill"},{pt:"por favor",en:"please"},
    ]
  },
  { id:"shopping",  label:"Às Compras",         sublabel:"Shopping",              icon:"🛍️", color:C.ochre,
    words:[
      {pt:"quanto custa?",en:"how much does it cost?"},{pt:"barato",en:"cheap/inexpensive"},
      {pt:"caro",en:"expensive"},{pt:"a loja",en:"the shop"},{pt:"o mercado",en:"the market"},
      {pt:"posso ajudar?",en:"can I help you?"},{pt:"quero comprar",en:"I want to buy"},
      {pt:"tem…?",en:"do you have…?"},{pt:"grande",en:"large"},{pt:"pequeno",en:"small"},
      {pt:"o dinheiro",en:"the money"},{pt:"o cartão",en:"the card"},
    ]
  },
  { id:"transport", label:"Transportes",        sublabel:"Getting Around Porto",  icon:"🚋", color:C.douro,
    words:[
      {pt:"o autocarro",en:"the bus"},{pt:"o metro",en:"the metro"},{pt:"o táxi",en:"the taxi"},
      {pt:"a paragem",en:"the stop/station"},{pt:"onde fica…?",en:"where is…?"},
      {pt:"à esquerda",en:"to the left"},{pt:"à direita",en:"to the right"},
      {pt:"em frente",en:"straight ahead"},{pt:"perto",en:"near"},{pt:"longe",en:"far"},
      {pt:"a ponte",en:"the bridge"},{pt:"a rua",en:"the street"},
    ]
  },
  { id:"family",    label:"Família e Casa",     sublabel:"Family & Home",         icon:"🏡", color:C.portWine,
    words:[
      {pt:"a família",en:"the family"},{pt:"o pai",en:"the father"},{pt:"a mãe",en:"the mother"},
      {pt:"o filho",en:"the son"},{pt:"a filha",en:"the daughter"},{pt:"o irmão",en:"the brother"},
      {pt:"a irmã",en:"the sister"},{pt:"os avós",en:"the grandparents"},
      {pt:"a casa",en:"the home/house"},{pt:"a sala",en:"the living room"},
      {pt:"bem-vindo",en:"welcome"},{pt:"a bênção",en:"the blessing"},
    ]
  },
  { id:"gospel",    label:"Evangelho",          sublabel:"Gospel & Church",       icon:"🙏", color:C.green,
    words:[
      {pt:"a Igreja",en:"the Church"},{pt:"o profeta",en:"the prophet"},{pt:"a fé",en:"faith"},
      {pt:"o batismo",en:"baptism"},{pt:"a oração",en:"the prayer"},{pt:"a escritura",en:"the scripture"},
      {pt:"o Espírito Santo",en:"the Holy Spirit"},{pt:"a restauração",en:"the Restoration"},
      {pt:"arrepender",en:"to repent"},{pt:"o testemunho",en:"the testimony"},
      {pt:"eterno",en:"eternal"},{pt:"a salvação",en:"salvation"},
      {pt:"o evangelho",en:"the gospel"},{pt:"a aliança",en:"the covenant"},
      {pt:"a expiação",en:"the Atonement"},{pt:"a ressurreição",en:"the Resurrection"},
      {pt:"o livre-arbítrio",en:"agency/free will"},{pt:"o plano de salvação",en:"the plan of salvation"},
      {pt:"a vida eterna",en:"eternal life"},{pt:"o Céu",en:"heaven"},
    ]
  },
  { id:"church",    label:"A Igreja",           sublabel:"LDS Church Organisation", icon:"⛪", color:C.azulejo,
    words:[
      {pt:"o sacerdócio",en:"the priesthood"},{pt:"a ala",en:"the ward"},
      {pt:"a estaca",en:"the stake"},{pt:"o bispo",en:"the bishop"},
      {pt:"o presidente de ramo",en:"the branch president"},{pt:"o ramo",en:"the branch"},
      {pt:"a Sociedade de Socorro",en:"Relief Society"},{pt:"o Quórum de Élderes",en:"Elders Quorum"},
      {pt:"a Primária",en:"Primary"},{pt:"os Rapazes Jovens",en:"Young Men"},
      {pt:"as Raparigas Jovens",en:"Young Women"},{pt:"o diácono",en:"the deacon"},
      {pt:"o professor",en:"the teacher (Aaronic)"},{pt:"o sacerdote",en:"the priest"},
      {pt:"o élder",en:"the elder"},{pt:"o apóstolo",en:"the apostle"},
      {pt:"os Doze Apóstolos",en:"the Twelve Apostles"},{pt:"a Primeira Presidência",en:"the First Presidency"},
      {pt:"o presidente de missão",en:"the mission president"},{pt:"o missionário/a missionária",en:"the missionary (m/f)"},
      {pt:"a conferência",en:"the conference"},{pt:"o templo",en:"the temple"},
      {pt:"a capelinha",en:"the chapel"},{pt:"o jejum",en:"the fast"},
      {pt:"o dízimo",en:"the tithe"},{pt:"a bênção patriarcal",en:"the patriarchal blessing"},
    ]
  },
  { id:"feelings",  label:"Sentimentos",        sublabel:"Feelings & Connection", icon:"💛", color:C.teal,
    words:[
      {pt:"feliz",en:"happy"},{pt:"triste",en:"sad"},{pt:"grato/grata",en:"grateful (m/f)"},
      {pt:"esperança",en:"hope"},{pt:"paz",en:"peace"},{pt:"amor",en:"love"},
      {pt:"saudade",en:"longing/nostalgia"},{pt:"entender",en:"to understand"},
      {pt:"sentir",en:"to feel"},{pt:"acreditar",en:"to believe"},
      {pt:"confiar",en:"to trust"},{pt:"partilhar",en:"to share"},
    ]
  },
];

// ══════════════════════════════════════════════════════════════════════════════
//  PHASE 3 — SPEAKING EXERCISES (4 levels)
// ══════════════════════════════════════════════════════════════════════════════
const SPEAK_LEVELS = [
  { id:"sounds",  label:"Nível 1",  sublabel:"Sounds & Words",      color:C.green,
    note:"Master these tricky sounds first — they define the Porto accent.",
    exercises:[
      {id:"s1",  pt:"lh",           hint:"Like 'lli' in million",         type:"sound"},
      {id:"s2",  pt:"nh",           hint:"Like 'ny' in canyon",           type:"sound"},
      {id:"s3",  pt:"irmão",        hint:"Nasal 'ow' — speak through nose",type:"word"},
      {id:"s4",  pt:"missão",       hint:"mee-SOWN — nasal ending",       type:"word"},
      {id:"s5",  pt:"senhor",       hint:"seh-NYOR — NH = ny sound",      type:"word"},
      {id:"s6",  pt:"exemplo",      hint:"esh-EM-plo — X = sh in pt-PT",  type:"word"},
      {id:"s7",  pt:"Jesus",        hint:"zheh-ZOOSH — J = zh, S = sh",   type:"word"},
      {id:"s8",  pt:"evangelho",    hint:"ee-van-ZHEL-yo",                type:"word"},
    ]
  },
  { id:"basic",   label:"Nível 2",  sublabel:"Basic Phrases",        color:C.azulejo,
    note:"Short everyday phrases — say them until they feel natural.",
    exercises:[
      {id:"b1",  pt:"Bom dia!",                   hint:"Good morning — boom DEE-ah",          type:"phrase"},
      {id:"b2",  pt:"Como está?",                 hint:"How are you? — formal",               type:"phrase"},
      {id:"b3",  pt:"Tudo bem, obrigada.",         hint:"All is well, thank you (fem.)",       type:"phrase"},
      {id:"b4",  pt:"Muito prazer!",              hint:"Great pleasure! — meeting someone",   type:"phrase"},
      {id:"b5",  pt:"Até amanhã.",                hint:"See you tomorrow",                    type:"phrase"},
      {id:"b6",  pt:"O meu nome é Irmã Bennett.", hint:"My name is Sister Bennett",           type:"phrase"},
      {id:"b7",  pt:"Deus ama-te.",               hint:"God loves you — DEH-oosh",            type:"phrase"},
      {id:"b8",  pt:"Posso partilhar uma mensagem?", hint:"May I share a message?",           type:"phrase"},
    ]
  },
  { id:"mission", label:"Nível 3",  sublabel:"Mission Sentences",    color:C.terra,
    note:"Full missionary sentences — the language of every door and lesson.",
    exercises:[
      {id:"m1",  pt:"Somos missionárias de A Igreja de Jesus Cristo dos Santos dos Últimos Dias.", hint:"Full Church name — practice until effortless", type:"sentence"},
      {id:"m2",  pt:"Queremos falar sobre Jesus Cristo e o Seu evangelho.",                        hint:"We want to speak about Jesus Christ and His gospel", type:"sentence"},
      {id:"m3",  pt:"O Livro de Mórmon é outra testemunha de Jesus Cristo.",                      hint:"The Book of Mormon is another witness of Jesus Christ", type:"sentence"},
      {id:"m4",  pt:"A família é ordenada por Deus.",                                             hint:"The family is ordained of God — a key teaching", type:"sentence"},
      {id:"m5",  pt:"Sei que Deus é o nosso Pai Celestial.",                                      hint:"I know that God is our Heavenly Father — testimony", type:"sentence"},
      {id:"m6",  pt:"Convidamo-la a ser batizada.",                                               hint:"We invite you to be baptized — addressing a woman", type:"sentence"},
      {id:"m7",  pt:"Querido Pai Celestial, somos gratas pelas Tuas bênçãos.",                    hint:"Opening a prayer — Dear Heavenly Father", type:"sentence"},
      {id:"m8",  pt:"Pedimos isto em nome de Jesus Cristo, Amém.",                               hint:"Closing a prayer — always the same", type:"sentence"},
    ]
  },
  { id:"scripture",label:"Nível 4", sublabel:"Scripture Passages",   color:C.portWine,
    note:"The words you will read aloud in lessons — aim for smooth, reverent delivery.",
    exercises:[
      {id:"sc1", pt:"Porque Deus amou o mundo de tal maneira que deu o seu Filho Unigénito.",     hint:"John 3:16 opening — because God loved the world so much", type:"scripture"},
      {id:"sc2", pt:"para que todo o que nele crê não pereça, mas tenha a vida eterna.",          hint:"John 3:16 ending — so that all who believe shall not perish", type:"scripture"},
      {id:"sc3", pt:"O Pai Celestial ama todos os Seus filhos e quer que regressem a Ele.",       hint:"PMG Ch.1 — Heavenly Father loves all His children", type:"scripture"},
      {id:"sc4", pt:"assim, pressionai avante com firmeza em Cristo, tendo um brilho perfeito de esperança.", hint:"2 Nephi 31:20 — press forward with steadfastness", type:"scripture"},
    ]
  },
];

// ══════════════════════════════════════════════════════════════════════════════
//  PHASE 3 — READINESS SCORE CALCULATION
// ══════════════════════════════════════════════════════════════════════════════
function calcReadiness(alphaData, phraseData, vocabData, cultureData, readerData, speakingData) {
  const totalPhrases = 27;
  const lettersMastered = Object.values(alphaData.plays||{}).filter(v=>v>=3).length;
  const phrasesMastered = Object.keys(phraseData.mastered||{}).length;
  const totalVocab = VOCAB_CATS.reduce((a,c)=>a+c.words.length,0);
  const vocabHeard = Object.keys(vocabData.heard||{}).length;
  const cultureRead = Object.keys(cultureData.read||{}).length;
  const textsCompleted = Object.keys(readerData.completed||{}).length;
  const speakSessions = speakingData.sessions||0;
  const totalSpeakEx = SPEAK_LEVELS.reduce((a,l)=>a+l.exercises.length,0);
  const speakPracticed = Object.keys(speakingData.scores||{}).length;

  const a = (lettersMastered/26)*15;
  const b = (phrasesMastered/totalPhrases)*25;
  const c = (vocabHeard/totalVocab)*20;
  const d = (cultureRead/6)*15;
  const e = (textsCompleted/5)*10;
  const f = Math.min((speakPracticed/totalSpeakEx)*15,15);
  const total = Math.round(a+b+c+d+e+f);

  return {
    total, lettersMastered, phrasesMastered,
    vocabHeard, totalVocab, cultureRead, textsCompleted, speakPracticed, totalSpeakEx,
    breakdown:[
      {label:"Alphabet mastered",   score:Math.round(a), max:15, value:`${lettersMastered}/26`,    color:C.green},
      {label:"Phrases mastered",    score:Math.round(b), max:25, value:`${phrasesMastered}/${totalPhrases}`, color:C.azulejo},
      {label:"Vocabulary heard",    score:Math.round(c), max:20, value:`${vocabHeard}/${totalVocab}`,color:C.terra},
      {label:"Culture studied",     score:Math.round(d), max:15, value:`${cultureRead}/6`,          color:C.portWine},
      {label:"Texts completed",     score:Math.round(e), max:10, value:`${textsCompleted}/5`,       color:C.douro},
      {label:"Speaking practice",   score:Math.round(f), max:15, value:`${speakPracticed}/${totalSpeakEx}`, color:C.ochre},
    ]
  };
}

// ══════════════════════════════════════════════════════════════════════════════
//  SHARED HELPERS & HOOKS
// ══════════════════════════════════════════════════════════════════════════════
function speakPT(text,rate=0.82) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text); u.lang="pt-PT"; u.rate=rate;
  const vs=window.speechSynthesis.getVoices();
  const v=vs.find(v=>v.lang==="pt-PT")||vs.find(v=>v.lang.startsWith("pt-PT"))||vs.find(v=>v.lang.startsWith("pt"));
  if(v)u.voice=v; window.speechSynthesis.speak(u);
}
function useLS(key,init) {
  const [val,setVal]=useState(()=>{try{const v=localStorage.getItem(key);return v?JSON.parse(v):init;}catch{return init;}});
  const save=useCallback((v)=>{setVal(v);try{localStorage.setItem(key,JSON.stringify(v));}catch{}},[key]);
  return [val,save];
}
const toDay=()=>new Date().toISOString().split("T")[0];
const dayOff=n=>new Date(Date.now()+n*86400000).toISOString().split("T")[0];
function useStreak() {
  const [data,save]=useLS("sb-streak",{current:0,longest:0,lastDate:null,total:0,log:[]});
  useEffect(()=>{
    const today=toDay(); if(data.lastDate===today) return;
    const yest=dayOff(-1); const streak=data.lastDate===yest?(data.current||0)+1:1;
    save({current:streak,longest:Math.max(streak,data.longest||0),lastDate:today,total:(data.total||0)+1,log:[...(data.log||[]).slice(-90),today]});
  },[]);
  return data;
}
function useCountdown(iso) {
  const [t,setT]=useState({});
  useEffect(()=>{
    const calc=()=>{const diff=new Date(iso)-Date.now();if(diff<=0)return setT({done:true});const s=Math.floor(diff/1000);setT({months:Math.floor(s/(30.44*86400)),weeks:Math.floor(s/(7*86400)),days:Math.floor(s/86400),hours:Math.floor((s%86400)/3600),minutes:Math.floor((s%3600)/60),seconds:s%60});};
    calc();const id=setInterval(calc,1000);return()=>clearInterval(id);
  },[iso]);
  return t;
}
function FlagStrip({width=48,height=8}){
  return(<svg width={width} height={height} viewBox="0 0 48 8" style={{borderRadius:2,overflow:"hidden",display:"block"}}><rect x="0" y="0" width="19" height="8" fill={C.green}/><rect x="19" y="0" width="29" height="8" fill={C.red}/><circle cx="19" cy="4" r="4" fill={C.gold}/><circle cx="19" cy="4" r="2.5" fill="none" stroke={C.red} strokeWidth="0.6"/></svg>);
}
function AzPat({size=120,opacity=0.07}){
  return(<svg width={size} height={size} viewBox="0 0 40 40" style={{position:"absolute",top:0,right:0,opacity,pointerEvents:"none"}}><rect x="2" y="2" width="16" height="16" fill="none" stroke={C.azulejo} strokeWidth="0.8"/><rect x="22" y="2" width="16" height="16" fill="none" stroke={C.azulejo} strokeWidth="0.8"/><rect x="2" y="22" width="16" height="16" fill="none" stroke={C.azulejo} strokeWidth="0.8"/><rect x="22" y="22" width="16" height="16" fill="none" stroke={C.azulejo} strokeWidth="0.8"/><circle cx="10" cy="10" r="4" fill="none" stroke={C.azulejo} strokeWidth="0.6"/><circle cx="30" cy="10" r="4" fill="none" stroke={C.azulejo} strokeWidth="0.6"/><circle cx="10" cy="30" r="4" fill="none" stroke={C.azulejo} strokeWidth="0.6"/><circle cx="30" cy="30" r="4" fill="none" stroke={C.azulejo} strokeWidth="0.6"/><line x1="10" y1="6" x2="10" y2="14" stroke={C.azulejo} strokeWidth="0.5"/><line x1="6" y1="10" x2="14" y2="10" stroke={C.azulejo} strokeWidth="0.5"/><line x1="30" y1="6" x2="30" y2="14" stroke={C.azulejo} strokeWidth="0.5"/><line x1="26" y1="10" x2="34" y2="10" stroke={C.azulejo} strokeWidth="0.5"/></svg>);
}

// ══════════════════════════════════════════════════════════════════════════════
//  STREAK COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════
function StreakBadge({streak}){
  const cur=streak.current||0; const ms=[...MILESTONES].reverse().find(m=>m.days<=cur);
  return(<div style={{background:"rgba(200,165,39,0.18)",border:`0.5px solid ${C.gold}`,borderRadius:"20px",padding:"6px 12px",display:"flex",alignItems:"center",gap:"7px",flexShrink:0}}><span style={{fontSize:"18px",lineHeight:1}}>{cur===0?"✨":ms?ms.icon:"🔥"}</span><div><div style={{fontSize:"17px",fontWeight:"600",color:C.gold,lineHeight:1,fontFamily:"Georgia,serif"}}>{cur}</div><div style={{fontSize:"9px",color:"rgba(200,165,39,0.7)",lineHeight:1,letterSpacing:"0.08em",textTransform:"uppercase",marginTop:"1px"}}>day streak</div></div></div>);
}
function StreakCard({streak}){
  const cur=streak.current||0; const nextMs=MILESTONES.find(m=>m.days>cur); const prevMs=[...MILESTONES].reverse().find(m=>m.days<=cur);
  const pct=nextMs?Math.round(((cur-(prevMs?.days||0))/(nextMs.days-(prevMs?.days||0)))*100):100;
  const last30=Array.from({length:30},(_,i)=>{const d=new Date(Date.now()-(29-i)*86400000);const str=d.toISOString().split("T")[0];return{str,studied:(streak.log||[]).includes(str),isToday:str===toDay()};});
  const earned=MILESTONES.filter(m=>m.days<=cur);
  return(
    <div style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:"18px",padding:"20px",marginBottom:"18px",borderTop:`3px solid ${C.gold}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"18px"}}>
        <div>
          <div style={{fontSize:"11px",letterSpacing:"0.12em",textTransform:"uppercase",color:C.faint,marginBottom:"4px"}}>Daily Streak</div>
          <div style={{display:"flex",alignItems:"baseline",gap:"8px"}}>
            <span style={{fontFamily:"Georgia,serif",fontSize:"48px",fontWeight:"400",color:C.green,lineHeight:1}}>{cur}</span>
            <span style={{fontSize:"15px",color:C.muted}}>days</span>
          </div>
          {prevMs&&<div style={{fontSize:"13px",color:prevMs.clr,marginTop:"2px",display:"flex",alignItems:"center",gap:"5px"}}><span>{prevMs.icon}</span>{prevMs.label}</div>}
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:"11px",color:C.faint}}>Longest streak</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:"26px",color:C.muted}}>{streak.longest||0}</div>
          <div style={{fontSize:"11px",color:C.faint,marginTop:"6px"}}>Total days studied</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:"22px",color:C.muted}}>{streak.total||0}</div>
        </div>
      </div>
      {nextMs&&(<div style={{marginBottom:"16px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}><span style={{fontSize:"12px",color:C.muted}}>Next: {nextMs.icon} <strong style={{color:C.ink}}>{nextMs.label}</strong></span><span style={{fontSize:"12px",color:C.muted}}>{nextMs.days-cur} days away</span></div><div style={{height:"8px",background:C.border,borderRadius:"4px",overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",borderRadius:"4px",background:`linear-gradient(to right,${C.green},${C.gold})`,transition:"width 0.8s"}}/></div></div>)}
      <div style={{marginBottom:"14px"}}>
        <div style={{fontSize:"11px",color:C.faint,marginBottom:"7px",letterSpacing:"0.1em",textTransform:"uppercase"}}>Last 30 days</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(10,1fr)",gap:"4px"}}>
          {last30.map((d,i)=>(<div key={i} title={d.str} style={{aspectRatio:"1",borderRadius:"3px",background:d.studied?C.green:d.isToday?C.softGold:C.border,border:d.isToday?`1.5px solid ${C.gold}`:"none"}}/>))}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:"4px",fontSize:"10px",color:C.faint}}>
          <span>30 days ago</span>
          <div style={{display:"flex",alignItems:"center",gap:"5px"}}><div style={{width:"10px",height:"10px",borderRadius:"2px",background:C.green}}/><span>Studied</span><div style={{width:"10px",height:"10px",borderRadius:"2px",background:C.border,marginLeft:"6px"}}/><span>Missed</span></div>
          <span>Today</span>
        </div>
      </div>
      {earned.length>0?(<div><div style={{fontSize:"11px",color:C.faint,marginBottom:"7px",letterSpacing:"0.1em",textTransform:"uppercase"}}>Milestones earned</div><div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>{earned.map(m=>(<div key={m.days} style={{background:C.softGold,border:`0.5px solid ${C.border}`,borderRadius:"20px",padding:"4px 11px",fontSize:"12px",color:C.ochre,display:"flex",alignItems:"center",gap:"5px"}}><span>{m.icon}</span>{m.label}</div>))}</div></div>):(<div style={{background:C.softGold,borderRadius:"10px",padding:"10px 14px",fontSize:"13px",color:C.ochre,textAlign:"center"}}>🌟 Study today to earn your first milestone — <strong>First Step!</strong></div>)}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  COUNTDOWN VIEW
// ══════════════════════════════════════════════════════════════════════════════
function CountdownView({streak,alphaData,phraseData,cultureData,readerData}){
  const t=useCountdown("2026-10-28T09:00:00");
  const units=[{l:"Months",v:t.months},{l:"Weeks",v:t.weeks},{l:"Days",v:t.days},{l:"Hours",v:t.hours},{l:"Minutes",v:t.minutes},{l:"Seconds",v:t.seconds}];
  const DAILY=[{pt:"Eu posso fazer isto!",en:"I can do this!",note:"Affirmation"},{pt:"Eu sei que esta Igreja é verdadeira.",en:"I know this Church is true.",note:"Testimony"},{pt:"Deus ama-te.",en:"God loves you.",note:"Core message"},{pt:"A minha missão é abençoada.",en:"My mission is blessed.",note:"Confidence"}];
  const daily=DAILY[new Date().getDay()%DAILY.length];
  const totalPhrases=PHRASE_CATEGORIES.reduce((a,c)=>a+c.phrases.length,0);
  const totalSegs=READER_TEXTS.reduce((a,t)=>a+t.segments.length,0);
  const stats=[
    {label:"Letters heard",    value:`${Object.keys(alphaData.plays||{}).length}/26`,          color:C.azulejo},
    {label:"Phrases heard",    value:`${Object.keys(phraseData.plays||{}).length}/${totalPhrases}`, color:C.terra},
    {label:"Phrases mastered", value:`${Object.keys(phraseData.mastered||{}).length}/${totalPhrases}`,color:C.green},
    {label:"Culture topics",   value:`${Object.keys(cultureData.read||{}).length}/${CULTURE_SECTIONS.length}`,color:C.portWine},
    {label:"Reading segments", value:`${Object.keys(readerData.progress||{}).length}/${totalSegs}`,color:C.douro},
    {label:"Texts completed",  value:`${Object.keys(readerData.completed||{}).length}/${READER_TEXTS.length}`,color:C.ochre},
  ];
  return(
    <div style={{padding:"1.5rem 0"}}>
      <div style={{textAlign:"center",marginBottom:"10px"}}><div style={{display:"inline-block"}}><FlagStrip width={56} height={9}/></div><div style={{height:8}}/><span style={{fontSize:"11px",letterSpacing:"0.2em",textTransform:"uppercase",color:C.muted}}>Home MTC begins</span></div>
      <h2 style={{fontFamily:"Georgia,serif",textAlign:"center",fontSize:"24px",fontWeight:"400",color:C.green,marginBottom:"22px"}}>October 28, 2026 &nbsp;·&nbsp; Porto, Portugal 🇵🇹</h2>
      <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"9px",marginBottom:"26px"}}>
        {units.map((u,i)=>(<div key={u.l} style={{background:i<3?C.green:C.douro,borderRadius:"14px",padding:"16px 12px",minWidth:"68px",textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.15)"}}><div style={{fontFamily:"Georgia,serif",fontSize:"32px",fontWeight:"400",color:C.onDark,lineHeight:1}}>{t.done?"0":String(u.v??"--").padStart(2,"0")}</div><div style={{fontSize:"10px",letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(248,242,228,0.6)",marginTop:"5px"}}>{u.l}</div></div>))}
      </div>
      <StreakCard streak={streak}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"9px",marginBottom:"18px"}}>
        {stats.map(s=>(<div key={s.label} style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:"12px",padding:"13px",textAlign:"center",borderTop:`3px solid ${s.color}`}}><div style={{fontFamily:"Georgia,serif",fontSize:"20px",color:s.color,lineHeight:1}}>{s.value}</div><div style={{fontSize:"10px",color:C.faint,marginTop:"5px",lineHeight:1.3}}>{s.label}</div></div>))}
      </div>
      <div style={{borderRadius:"18px",overflow:"hidden",marginBottom:"18px",boxShadow:"0 4px 16px rgba(0,0,0,0.12)"}}>
        <div style={{display:"flex",height:"5px"}}><div style={{flex:2,background:C.green}}/><div style={{flex:3,background:C.red}}/></div>
        <div style={{background:C.douro,padding:"20px 24px"}}>
          <div style={{fontSize:"10px",letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(200,165,39,0.85)",marginBottom:"9px"}}>Frase do dia · Daily phrase</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:"20px",color:C.onDark,marginBottom:"6px",lineHeight:1.45}}>"{daily.pt}"</div>
          <div style={{fontSize:"13px",color:"rgba(248,242,228,0.6)",marginBottom:"16px"}}>{daily.en}</div>
          <button onClick={()=>speakPT(daily.pt,0.75)} style={{background:"rgba(255,255,255,0.12)",border:`0.5px solid ${C.gold}`,borderRadius:"10px",padding:"8px 16px",color:C.onDark,fontSize:"13px",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px"}}>🔊 Hear in European Portuguese</button>
        </div>
      </div>
      <div style={{background:C.surface,borderRadius:"14px",padding:"16px",border:`0.5px solid ${C.border}`}}>
        <div style={{display:"flex",gap:"10px",alignItems:"center",marginBottom:"11px"}}><FlagStrip width={42} height={7}/><span style={{fontSize:"13px",fontWeight:"500",color:C.ink}}>Mission overview</span></div>
        {[["Mission","Portugal Porto Mission"],["Language","European Portuguese (pt-PT)"],["MTC format","Home MTC · October 28, 2026"],["Service","18 months"],["City","Porto — UNESCO World Heritage, River Douro"]].map(([k,v])=>(<div key={k} style={{display:"flex",gap:"12px",padding:"5px 0",borderBottom:`0.5px solid ${C.border}`}}><div style={{fontSize:"12px",color:C.faint,width:"100px",flexShrink:0}}>{k}</div><div style={{fontSize:"12px",color:C.ink}}>{v}</div></div>))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  ALPHABET VIEW
// ══════════════════════════════════════════════════════════════════════════════
function AlphabetView({alphaData,saveAlphaData}){
  const [section,setSection]=useState("letters"); const [selected,setSelected]=useState(null); const [speaking,setSpeaking]=useState(null);
  const plays=alphaData.plays||{};
  const logPlay=(letter)=>{const p={...plays};p[letter]=(p[letter]||0)+1;saveAlphaData({...alphaData,plays:p});};
  const doSpeak=(l,e)=>{e.stopPropagation();setSpeaking(l.letter);logPlay(l.letter);speakPT(l.letter.toLowerCase(),0.7);setTimeout(()=>speakPT(l.example,0.75),700);setTimeout(()=>setSpeaking(null),1800);};
  const practicedCount=Object.keys(plays).length; const masteredCount=Object.values(plays).filter(v=>v>=3).length;
  return(
    <div style={{padding:"1.5rem 0"}}>
      <div style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:"12px",padding:"12px 16px",marginBottom:"14px",display:"flex",gap:"18px"}}>
        <div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}><span style={{fontSize:"12px",color:C.muted}}>Letters heard</span><span style={{fontSize:"12px",fontWeight:"500",color:C.green}}>{practicedCount}/26</span></div><div style={{height:"6px",background:C.border,borderRadius:"3px",overflow:"hidden"}}><div style={{width:`${(practicedCount/26)*100}%`,height:"100%",background:C.green,borderRadius:"3px",transition:"width 0.5s"}}/></div></div>
        <div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}><span style={{fontSize:"12px",color:C.muted}}>Mastered (3+)</span><span style={{fontSize:"12px",fontWeight:"500",color:C.gold}}>{masteredCount}/26</span></div><div style={{height:"6px",background:C.border,borderRadius:"3px",overflow:"hidden"}}><div style={{width:`${(masteredCount/26)*100}%`,height:"100%",background:C.gold,borderRadius:"3px",transition:"width 0.5s"}}/></div></div>
      </div>
      <div style={{display:"flex",gap:"8px",marginBottom:"14px"}}>
        {[{id:"letters",label:"🔡 The 26 Letters"},{id:"special",label:"⚡ Special Sounds"}].map(s=>(<button key={s.id} onClick={()=>{setSection(s.id);setSelected(null);}} style={{padding:"9px 18px",borderRadius:"10px",fontSize:"13px",cursor:"pointer",border:section===s.id?"none":`0.5px solid ${C.border}`,background:section===s.id?C.green:"transparent",color:section===s.id?C.onDark:C.muted,fontWeight:section===s.id?"500":"400"}}>{s.label}</button>))}
      </div>
      {section==="letters"&&(<>
        <p style={{fontSize:"13px",color:C.muted,lineHeight:1.7,marginBottom:"12px"}}>Tap a letter to expand. 🔊 plays the letter name then an example word in <strong style={{color:C.green}}>European Portuguese</strong>. A letter is <strong style={{color:C.gold}}>⭐ mastered</strong> after 3 plays. Progress saved.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(62px,1fr))",gap:"6px",marginBottom:"14px"}}>
          {ALPHABET_DATA.map(l=>{const count=plays[l.letter]||0;const mastered=count>=3;const practiced=count>0;const isSel=selected?.letter===l.letter;return(<button key={l.letter} onClick={()=>setSelected(isSel?null:l)} style={{background:isSel?C.green:mastered?C.softGold:practiced?"rgba(4,106,56,0.06)":C.surface,border:isSel?"none":mastered?`1.5px solid ${C.gold}`:practiced?`1px solid ${C.green}`:`0.5px solid ${C.border}`,borderRadius:"11px",padding:"10px 5px",cursor:"pointer",textAlign:"center",position:"relative"}}>{mastered&&!isSel&&<div style={{position:"absolute",top:"3px",right:"3px",fontSize:"8px"}}>⭐</div>}<div style={{fontFamily:"Georgia,serif",fontSize:"23px",lineHeight:1,color:isSel?C.onDark:practiced?C.green:C.ink}}>{l.letter}</div><div style={{fontSize:"9px",marginTop:"2px",color:isSel?"rgba(248,242,228,0.65)":C.faint}}>{l.name}</div>{count>0&&!isSel&&<div style={{fontSize:"9px",color:mastered?C.ochre:C.green,marginTop:"1px"}}>{count>=3?"✓×"+count:"×"+count}</div>}</button>);})}
        </div>
        {selected&&(
          <div style={{background:C.green,borderRadius:"18px",padding:"22px",boxShadow:"0 4px 14px rgba(4,106,56,0.25)"}}>
            <div style={{display:"flex",height:"3px",borderRadius:"2px",overflow:"hidden",marginBottom:"14px"}}><div style={{flex:2,background:"rgba(255,255,255,0.25)"}}/><div style={{flex:3,background:C.red}}/></div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"14px"}}>
              <div><span style={{fontFamily:"Georgia,serif",fontSize:"50px",color:C.onDark,lineHeight:1}}>{selected.letter}</span><span style={{fontFamily:"Georgia,serif",fontSize:"50px",color:"rgba(248,242,228,0.3)",lineHeight:1,marginLeft:"8px"}}>{selected.letter.toLowerCase()}</span><div style={{fontSize:"13px",color:"rgba(248,242,228,0.6)",marginTop:"3px"}}>Named: "{selected.name}" · Played: {plays[selected.letter]||0}×{(plays[selected.letter]||0)>=3&&<span style={{color:C.gold}}> ⭐ Mastered!</span>}</div></div>
              <button onClick={e=>doSpeak(selected,e)} style={{background:speaking===selected.letter?C.red:"rgba(255,255,255,0.14)",border:"none",borderRadius:"12px",padding:"12px 16px",color:C.onDark,fontSize:"22px",cursor:"pointer",transition:"background 0.2s",flexShrink:0}}>🔊</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"11px"}}>
              <div style={{background:"rgba(255,255,255,0.1)",borderRadius:"10px",padding:"13px"}}><div style={{fontSize:"10px",letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(200,165,39,0.85)",marginBottom:"4px"}}>IPA sound</div><div style={{fontFamily:"Georgia,serif",fontSize:"19px",color:C.onDark}}>{selected.ipa}</div></div>
              <div style={{background:"rgba(255,255,255,0.1)",borderRadius:"10px",padding:"13px"}}><div style={{fontSize:"10px",letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(200,165,39,0.85)",marginBottom:"4px"}}>Mission word</div><div style={{fontSize:"17px",color:C.onDark}}>{selected.example}</div><div style={{fontSize:"12px",color:"rgba(248,242,228,0.5)"}}>{selected.meaning}</div></div>
            </div>
            <div style={{background:"rgba(200,165,39,0.18)",borderRadius:"10px",padding:"13px",borderLeft:`3px solid ${C.gold}`}}><div style={{fontSize:"10px",letterSpacing:"0.1em",textTransform:"uppercase",color:C.gold,marginBottom:"4px"}}>Pronunciation tip</div><div style={{fontSize:"13px",color:C.onDark,lineHeight:1.6}}>{selected.tip}</div></div>
          </div>
        )}
      </>)}
      {section==="special"&&(<>
        <p style={{fontSize:"13px",color:C.muted,lineHeight:1.7,marginBottom:"12px"}}>These combinations define European Portuguese. Each has a colour from Porto's regional palette.</p>
        <div style={{display:"flex",flexDirection:"column",gap:"9px"}}>
          {SPECIAL_SOUNDS.map(s=>(<div key={s.combo} style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:"14px",padding:"15px",display:"flex",gap:"13px",alignItems:"flex-start"}}><div style={{background:s.clr,color:C.onDark,borderRadius:"10px",width:"54px",height:"54px",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",fontSize:"18px",fontWeight:"600",flexShrink:0,letterSpacing:"1px"}}>{s.combo}</div><div style={{flex:1}}><div style={{display:"flex",alignItems:"baseline",gap:"8px",flexWrap:"wrap",marginBottom:"3px"}}><span style={{fontFamily:"Georgia,serif",fontSize:"16px",color:C.ink}}>"{s.example}"</span><span style={{fontSize:"12px",color:C.muted}}>= {s.meaning}</span><span style={{fontFamily:"Georgia,serif",fontSize:"11px",color:s.clr}}>{s.ipa}</span></div><div style={{fontSize:"13px",color:C.ink,lineHeight:1.5,marginBottom:"5px"}}>{s.tip}</div><div style={{fontSize:"11px",color:C.faint,background:C.border,padding:"3px 9px",borderRadius:"6px",display:"inline-block"}}>Common: {s.why}</div></div><button onClick={()=>speakPT(s.example,0.75)} style={{background:s.clr,border:"none",borderRadius:"9px",padding:"9px 12px",color:C.onDark,fontSize:"18px",cursor:"pointer",flexShrink:0}}>🔊</button></div>))}
        </div>
      </>)}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  PHRASES VIEW
// ══════════════════════════════════════════════════════════════════════════════
function PhraseCard({phrase,index,color,phraseId,phraseData,savePhraseData}){
  const [isPlaying,setIsPlaying]=useState(false); const [showWbw,setShowWbw]=useState(false);
  const [recording,setRecording]=useState(false); const [transcript,setTranscript]=useState(""); const [score,setScore]=useState(null);
  const recRef=useRef(null);
  const plays=(phraseData.plays||{})[phraseId]||0; const scores=(phraseData.scores||{})[phraseId]||[];
  const best=scores.length?Math.max(...scores):null; const mastered=best!==null&&best>=80;
  const logPlay=()=>{const p={...(phraseData.plays||{})};p[phraseId]=(p[phraseId]||0)+1;savePhraseData({...phraseData,plays:p});};
  const logScore=(sc)=>{const s={...(phraseData.scores||{})};s[phraseId]=[...(s[phraseId]||[]).slice(-4),sc];const m={...(phraseData.mastered||{})};if(sc>=80)m[phraseId]=true;savePhraseData({...phraseData,scores:s,mastered:m});};
  const handlePlay=()=>{setIsPlaying(true);logPlay();speakPT(phrase.pt);setTimeout(()=>setIsPlaying(false),Math.max(1800,phrase.pt.length*80));};
  const handleRecord=()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){setTranscript("Speech recognition requires Chrome or Edge.");return;}if(recording){recRef.current?.stop();setRecording(false);return;}const rec=new SR();rec.lang="pt-PT";rec.continuous=false;rec.interimResults=false;recRef.current=rec;rec.onresult=e=>{const said=e.results[0][0].transcript;setTranscript(said);const cl=s=>s.toLowerCase().replace(/[.,!?;:]/g,"").trim();const tW=cl(phrase.pt).split(" ");const gW=cl(said).split(" ");const mt=tW.filter(w=>gW.some(g=>g.includes(w.slice(0,4))||w.includes(g.slice(0,4)))).length;const sc=Math.round((mt/tW.length)*100);setScore(sc);logScore(sc);};rec.onerror=()=>{setRecording(false);setTranscript("Could not hear — try again.");};rec.onend=()=>setRecording(false);rec.start();setRecording(true);setTranscript("");setScore(null);};
  return(
    <div style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:"14px",padding:"14px 16px",marginBottom:"9px",borderLeft:`3px solid ${mastered?C.gold:plays>0?color:C.border}`}}>
      <div style={{display:"flex",gap:"10px",alignItems:"flex-start"}}>
        <div style={{width:"26px",height:"26px",borderRadius:"50%",flexShrink:0,background:mastered?C.gold:color,color:C.onDark,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",marginTop:"3px"}}>{mastered?"⭐":index+1}</div>
        <div style={{flex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:"8px"}}><div style={{fontFamily:"Georgia,serif",fontSize:"16px",color:C.ink,lineHeight:1.45,marginBottom:"3px",flex:1}}>{phrase.pt}</div><div style={{flexShrink:0,textAlign:"right"}}>{plays>0&&<div style={{fontSize:"10px",color:C.faint}}>heard ×{plays}</div>}{best!==null&&<div style={{fontSize:"10px",color:mastered?C.green:C.terra,fontWeight:"500"}}>best {best}%</div>}</div></div>
          <div style={{fontSize:"13px",color:C.muted,marginBottom:"8px"}}>{phrase.en}</div>
          {phrase.note&&<div style={{fontSize:"11px",color:C.muted,background:C.bg,padding:"3px 10px",borderRadius:"20px",display:"inline-block",marginBottom:"8px",border:`0.5px solid ${C.border}`}}>💡 {phrase.note}</div>}
          <div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>
            <button onClick={handlePlay} style={{background:isPlaying?C.red:color,border:"none",borderRadius:"8px",padding:"6px 12px",color:C.onDark,fontSize:"12px",cursor:"pointer",transition:"background 0.2s"}}>🔊 {isPlaying?"Playing...":"Hear it"}</button>
            <button onClick={()=>setShowWbw(!showWbw)} style={{background:showWbw?C.gold:"transparent",border:`0.5px solid ${showWbw?C.gold:C.border}`,borderRadius:"8px",padding:"6px 12px",color:showWbw?C.onDark:C.muted,fontSize:"12px",cursor:"pointer"}}>📝 Word-for-word</button>
            <button onClick={handleRecord} style={{background:recording?C.red:"transparent",border:`0.5px solid ${recording?C.red:C.border}`,borderRadius:"8px",padding:"6px 12px",color:recording?C.onDark:C.muted,fontSize:"12px",cursor:"pointer"}}>🎤 {recording?"Listening...":"Say it"}</button>
          </div>
          {showWbw&&<div style={{marginTop:"9px",background:C.softGold,borderRadius:"10px",padding:"10px 13px",border:`0.5px solid ${C.border}`}}><div style={{fontSize:"10px",letterSpacing:"0.1em",textTransform:"uppercase",color:C.ochre,marginBottom:"4px"}}>Word-for-word</div><div style={{fontFamily:"Georgia,serif",fontSize:"13px",color:C.ink,fontStyle:"italic",lineHeight:1.55}}>"{phrase.wbw}"</div><div style={{fontSize:"11px",color:C.muted,marginTop:"4px"}}>Literal structure — not grammatical English. Notice articles, prepositions, and word order.</div></div>}
          {transcript&&(<div style={{marginTop:"9px",background:C.softGreen,borderRadius:"10px",padding:"10px 13px",border:`0.5px solid ${C.border}`}}><div style={{fontSize:"10px",letterSpacing:"0.1em",textTransform:"uppercase",color:C.green,marginBottom:"3px"}}>You said</div><div style={{fontFamily:"Georgia,serif",fontSize:"14px",color:C.ink,marginBottom:"8px"}}>"{transcript}"</div>{score!==null&&(<><div style={{display:"flex",alignItems:"center",gap:"9px",marginBottom:"3px"}}><div style={{flex:1,height:"7px",background:C.border,borderRadius:"4px",overflow:"hidden"}}><div style={{width:`${score}%`,height:"100%",borderRadius:"4px",background:score>=80?C.green:score>=50?C.gold:C.red,transition:"width 0.6s"}}/></div><span style={{fontSize:"13px",fontWeight:"500",minWidth:"34px",color:score>=80?C.green:score>=50?C.ochre:C.red}}>{score}%</span></div><div style={{fontSize:"12px",color:score>=80?C.green:score>=50?C.ochre:C.red}}>{score>=80?"🎉 Excellent! Phrase mastered!":score>=50?"👍 Good — listen once more and retry!":"🔄 Keep going — listen carefully then repeat!"}{score>=80&&<span style={{color:C.gold,marginLeft:"6px",fontWeight:"500"}}>⭐ Saved!</span>}</div></>)}</div>)}
        </div>
      </div>
    </div>
  );
}
function PhrasesView({phraseData,savePhraseData}){
  const [cat,setCat]=useState("greetings"); const active=PHRASE_CATEGORIES.find(c=>c.id===cat);
  const totalPhrases=PHRASE_CATEGORIES.reduce((a,c)=>a+c.phrases.length,0); const mastered=Object.keys(phraseData.mastered||{}).length;
  return(
    <div style={{padding:"1.5rem 0"}}>
      <div style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:"12px",padding:"12px 16px",marginBottom:"14px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}><span style={{fontSize:"12px",color:C.muted}}>Phrases mastered (score ≥ 80%)</span><span style={{fontSize:"13px",fontWeight:"500",color:C.gold}}>{mastered}/{totalPhrases}</span></div><div style={{height:"7px",background:C.border,borderRadius:"4px",overflow:"hidden"}}><div style={{width:`${(mastered/totalPhrases)*100}%`,height:"100%",borderRadius:"4px",background:`linear-gradient(to right,${C.green},${C.gold})`,transition:"width 0.5s"}}/></div><div style={{fontSize:"11px",color:C.faint,marginTop:"5px"}}>🔊 Hear · 📝 Word-for-word structure · 🎤 Say it &amp; score · ⭐ 80%+ = mastered · All saved</div></div>
      <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"16px"}}>
        {PHRASE_CATEGORIES.map(c=>{const cm=c.phrases.filter((_,i)=>(phraseData.mastered||{})[`${c.id}-${i}`]).length;return(<button key={c.id} onClick={()=>setCat(c.id)} style={{padding:"8px 14px",borderRadius:"10px",fontSize:"13px",cursor:"pointer",border:cat===c.id?"none":`0.5px solid ${C.border}`,background:cat===c.id?c.color:"transparent",color:cat===c.id?C.onDark:C.muted,fontWeight:cat===c.id?"500":"400"}}>{c.label}<span style={{fontSize:"11px",opacity:0.7,marginLeft:"4px"}}>· {c.sublabel}</span>{cm>0&&<span style={{marginLeft:"5px",fontSize:"10px",background:cat===c.id?"rgba(255,255,255,0.2)":C.softGold,padding:"1px 5px",borderRadius:"10px",color:cat===c.id?C.onDark:C.ochre}}>⭐{cm}</span>}</button>);})}
      </div>
      {active&&active.phrases.map((p,i)=>(<PhraseCard key={i} phrase={p} index={i} color={active.color} phraseId={`${active.id}-${i}`} phraseData={phraseData} savePhraseData={savePhraseData}/>))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  CULTURE VIEW
// ══════════════════════════════════════════════════════════════════════════════
function CultureView({cultureData,saveCultureData}){
  const [active,setActive]=useState(null); const [vocabPlaying,setVocabPlaying]=useState(null);
  const markRead=(id)=>saveCultureData({...cultureData,read:{...(cultureData.read||{}),[id]:true}});
  const logVocab=(id,word)=>{const v={...(cultureData.vocab||{})};const k=`${id}-${word}`;v[k]=(v[k]||0)+1;saveCultureData({...cultureData,vocab:v});};
  const readCount=Object.keys(cultureData.read||{}).length; const vocabCount=Object.keys(cultureData.vocab||{}).length;
  if(active){
    const s=CULTURE_SECTIONS.find(s=>s.id===active);
    return(<div style={{padding:"1rem 0"}}>
      <button onClick={()=>setActive(null)} style={{display:"flex",alignItems:"center",gap:"6px",background:"transparent",border:"none",cursor:"pointer",color:C.muted,fontSize:"13px",padding:"6px 0",marginBottom:"14px"}}>← Back to Culture</button>
      <div style={{background:s.color,borderRadius:"18px",padding:"24px",marginBottom:"18px",position:"relative",overflow:"hidden",boxShadow:`0 4px 20px ${s.color}44`}}><AzPat size={150} opacity={0.12}/><div style={{display:"flex",height:"3px",borderRadius:"2px",overflow:"hidden",marginBottom:"16px"}}><div style={{flex:2,background:"rgba(255,255,255,0.3)"}}/><div style={{flex:3,background:C.red}}/></div><div style={{fontSize:"34px",marginBottom:"7px"}}>{s.icon}</div><h2 style={{fontFamily:"Georgia,serif",fontSize:"24px",fontWeight:"400",color:C.onDark,marginBottom:"3px"}}>{s.label}</h2><div style={{fontSize:"12px",color:"rgba(248,242,228,0.65)",marginBottom:"10px"}}>{s.sublabel}</div><div style={{fontSize:"14px",color:"rgba(248,242,228,0.85)",fontStyle:"italic",borderLeft:`3px solid ${C.gold}`,paddingLeft:"11px"}}>{s.tagline}</div></div>
      <div style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:"14px",padding:"18px",marginBottom:"14px"}}><div style={{fontSize:"11px",letterSpacing:"0.12em",textTransform:"uppercase",color:s.color,marginBottom:"12px",fontWeight:"500"}}>Cultural Background</div>{s.body.split("\n\n").map((p,i)=>(<p key={i} style={{fontSize:"14px",color:C.ink,lineHeight:1.8,marginBottom:i<s.body.split("\n\n").length-1?"12px":0}}>{p}</p>))}</div>
      <div style={{background:C.softGold,border:`0.5px solid ${C.border}`,borderLeft:`4px solid ${C.gold}`,borderRadius:"12px",padding:"14px",marginBottom:"14px"}}><div style={{fontSize:"11px",letterSpacing:"0.12em",textTransform:"uppercase",color:C.ochre,marginBottom:"7px",fontWeight:"500"}}>🙏 Missionary Connection</div><p style={{fontSize:"13px",color:C.ink,lineHeight:1.7,margin:0}}>{s.missionTip}</p></div>
      <div style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:"14px",padding:"16px"}}><div style={{fontSize:"11px",letterSpacing:"0.12em",textTransform:"uppercase",color:s.color,marginBottom:"12px",fontWeight:"500"}}>Key Vocabulary — tap to hear</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:"7px"}}>{s.vocab.map((v,i)=>{const pl=(cultureData.vocab||{})[`${s.id}-${v.pt}`]||0;return(<button key={i} onClick={()=>{speakPT(v.pt,0.8);setVocabPlaying(`${s.id}-${i}`);logVocab(s.id,v.pt);setTimeout(()=>setVocabPlaying(null),1500);}} style={{background:vocabPlaying===`${s.id}-${i}`?s.color:C.bg,border:`0.5px solid ${pl>0?s.color:C.border}`,borderRadius:"10px",padding:"9px 11px",cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}><div style={{fontSize:"13px",fontFamily:"Georgia,serif",color:vocabPlaying===`${s.id}-${i}`?C.onDark:s.color,marginBottom:"2px"}}>{v.pt}</div><div style={{fontSize:"11px",color:vocabPlaying===`${s.id}-${i}`?"rgba(248,242,228,0.7)":C.faint,display:"flex",justifyContent:"space-between"}}><span>{v.en}</span>{pl>0&&<span style={{color:C.gold}}>×{pl}</span>}</div></button>);})}</div></div>
      {!(cultureData.read||{})[s.id]?(<button onClick={()=>markRead(s.id)} style={{width:"100%",marginTop:"14px",background:C.green,border:"none",borderRadius:"12px",padding:"13px",color:C.onDark,fontSize:"14px",fontWeight:"500",cursor:"pointer"}}>✓ Mark as studied — save to progress</button>):(<div style={{textAlign:"center",marginTop:"12px",color:C.green,fontSize:"13px"}}>✅ Studied — saved to your progress</div>)}
    </div>);
  }
  return(<div style={{padding:"1.5rem 0"}}>
    <div style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:"12px",padding:"12px 16px",marginBottom:"16px",display:"flex",gap:"18px"}}>
      <div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}><span style={{fontSize:"12px",color:C.muted}}>Topics studied</span><span style={{fontSize:"12px",fontWeight:"500",color:C.terra}}>{readCount}/{CULTURE_SECTIONS.length}</span></div><div style={{height:"6px",background:C.border,borderRadius:"3px",overflow:"hidden"}}><div style={{width:`${(readCount/CULTURE_SECTIONS.length)*100}%`,height:"100%",background:C.terra,borderRadius:"3px"}}/></div></div>
      <div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}><span style={{fontSize:"12px",color:C.muted}}>Vocab heard</span><span style={{fontSize:"12px",fontWeight:"500",color:C.azulejo}}>{vocabCount} words</span></div><div style={{height:"6px",background:C.border,borderRadius:"3px",overflow:"hidden"}}><div style={{width:`${Math.min((vocabCount/60)*100,100)}%`,height:"100%",background:C.azulejo,borderRadius:"3px"}}/></div></div>
    </div>
    <p style={{fontSize:"13px",color:C.muted,lineHeight:1.7,marginBottom:"16px"}}>Understanding Porto and Portugal will make you a better missionary. Culture opens doors — especially when you know the stories, the music, and the food.</p>
    <div style={{display:"flex",flexDirection:"column",gap:"9px"}}>
      {CULTURE_SECTIONS.map(s=>{const read=(cultureData.read||{})[s.id];return(<button key={s.id} onClick={()=>setActive(s.id)} style={{background:read?s.bgColor:C.surface,border:`0.5px solid ${read?s.color:C.border}`,borderRadius:"16px",padding:"16px",cursor:"pointer",textAlign:"left",position:"relative",overflow:"hidden"}}><AzPat size={70} opacity={0.05}/><div style={{display:"flex",gap:"13px",alignItems:"flex-start",position:"relative"}}><div style={{width:"46px",height:"46px",borderRadius:"11px",background:s.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"21px",flexShrink:0,boxShadow:`0 2px 8px ${s.color}44`}}>{s.icon}</div><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontFamily:"Georgia,serif",fontSize:"16px",color:C.ink,marginBottom:"2px"}}>{s.label}</div><div style={{fontSize:"12px",color:s.color,marginBottom:"4px"}}>{s.sublabel}</div></div>{read&&<span style={{fontSize:"13px"}}>✅</span>}</div><div style={{fontSize:"12px",color:C.muted,lineHeight:1.5}}>{s.tagline}</div></div></div><div style={{marginTop:"9px",display:"flex",gap:"5px",flexWrap:"wrap"}}>{s.vocab.slice(0,4).map(v=>(<span key={v.pt} style={{fontSize:"11px",color:C.faint,background:C.bg,padding:"2px 7px",borderRadius:"9px",border:`0.5px solid ${C.border}`}}>{v.pt}</span>))}<span style={{fontSize:"11px",color:s.color}}>+{s.vocab.length-4} more →</span></div></button>);})}
    </div>
  </div>);
}

// ══════════════════════════════════════════════════════════════════════════════
//  READER VIEW
// ══════════════════════════════════════════════════════════════════════════════
function ReaderView({readerData,saveReaderData}){
  const [activeText,setActiveText]=useState(null); const [playing,setPlaying]=useState(null);
  const [showNotes,setShowNotes]=useState(true); const [highlight,setHighlight]=useState(null);
  const [catFilter,setCatFilter]=useLS("sb-reader-cat","all");
  const logRead=(id,seg)=>{const p={...(readerData.progress||{}),[`${id}-${seg}`]:true};const c={...(readerData.completed||{})};const text=READER_TEXTS.find(t=>t.id===id);if(text&&Object.keys(p).filter(k=>k.startsWith(id)).length>=text.segments.length)c[id]=true;saveReaderData({...readerData,progress:p,completed:c});};
  const playSegment=(seg,id,idx)=>{setPlaying(`${id}-${idx}`);setHighlight(idx);speakPT(seg.pt,0.78);setTimeout(()=>setPlaying(null),Math.max(2000,seg.pt.length*90));logRead(id,idx);};
  const completedCount=Object.keys(readerData.completed||{}).length; const segmentsRead=Object.keys(readerData.progress||{}).length;
  if(activeText){
    const text=READER_TEXTS.find(t=>t.id===activeText);
    const segsRead=Object.keys(readerData.progress||{}).filter(k=>k.startsWith(activeText)).length;
    const pct=Math.round((segsRead/text.segments.length)*100);
    return(<div style={{padding:"1rem 0"}}>
      <button onClick={()=>setActiveText(null)} style={{display:"flex",alignItems:"center",gap:"6px",background:"transparent",border:"none",cursor:"pointer",color:C.muted,fontSize:"13px",padding:"6px 0",marginBottom:"14px"}}>← Back to Reader</button>
      <div style={{background:text.levelColor,borderRadius:"16px",padding:"20px",marginBottom:"14px",position:"relative",overflow:"hidden",boxShadow:`0 4px 16px ${text.levelColor}44`}}><AzPat size={110} opacity={0.1}/><div style={{fontSize:"24px",marginBottom:"5px"}}>{text.icon}</div><div style={{fontFamily:"Georgia,serif",fontSize:"19px",color:C.onDark,marginBottom:"2px"}}>{text.title}</div><div style={{fontSize:"12px",color:"rgba(248,242,228,0.65)",marginBottom:"9px"}}>{text.subtitle}</div><div style={{display:"flex",gap:"9px",alignItems:"center"}}><span style={{fontSize:"11px",background:"rgba(255,255,255,0.15)",padding:"3px 9px",borderRadius:"9px",color:C.onDark}}>{text.level}</span><span style={{fontSize:"11px",color:"rgba(248,242,228,0.65)"}}>{segsRead}/{text.segments.length} heard · {pct}%</span></div><div style={{height:"4px",background:"rgba(255,255,255,0.2)",borderRadius:"2px",overflow:"hidden",marginTop:"9px"}}><div style={{width:`${pct}%`,height:"100%",background:C.gold,borderRadius:"2px",transition:"width 0.5s"}}/></div></div>
      <div style={{display:"flex",gap:"7px",marginBottom:"14px",flexWrap:"wrap"}}>
        <button onClick={()=>setShowNotes(!showNotes)} style={{padding:"7px 13px",borderRadius:"9px",fontSize:"12px",cursor:"pointer",border:`0.5px solid ${C.border}`,background:showNotes?C.softGold:"transparent",color:showNotes?C.ochre:C.muted}}>💡 {showNotes?"Hide notes":"Show notes"}</button>
        <button onClick={()=>{setHighlight(null);text.segments.forEach((seg,i)=>setTimeout(()=>playSegment(seg,activeText,i),i*3200));}} style={{padding:"7px 13px",borderRadius:"9px",fontSize:"12px",cursor:"pointer",border:"none",background:C.green,color:C.onDark}}>▶ Play all</button>
      </div>
      <div style={{background:C.softBlue,border:`0.5px solid ${C.azulejo}22`,borderLeft:`3px solid ${C.azulejo}`,borderRadius:"10px",padding:"9px 13px",marginBottom:"14px",fontSize:"12px",color:C.azulejo}}><strong>How to read:</strong> Left = Portuguese · Right = word-for-word English (literal). This trains your brain in Portuguese sentence structure. 🔊 plays each line.</div>
      {text.segments.map((seg,i)=>{const isPlaying=playing===`${activeText}-${i}`;const wasRead=!!(readerData.progress||{})[`${activeText}-${i}`];const isHighlit=highlight===i;return(<div key={i} style={{background:isHighlit?`${text.levelColor}18`:wasRead?C.softGreen:C.surface,border:`0.5px solid ${isHighlit?text.levelColor:wasRead?C.green:C.border}`,borderRadius:"14px",padding:"15px",marginBottom:"9px",transition:"all 0.25s"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"13px",marginBottom:showNotes&&seg.note?"9px":"0"}}>
          <div><div style={{fontSize:"10px",letterSpacing:"0.1em",textTransform:"uppercase",color:text.levelColor,marginBottom:"5px",fontWeight:"500"}}>🇵🇹 Português</div><div style={{fontFamily:"Georgia,serif",fontSize:"15px",color:C.ink,lineHeight:1.65}}>{seg.pt}</div></div>
          <div style={{borderLeft:`1px solid ${C.border}`,paddingLeft:"13px"}}><div style={{fontSize:"10px",letterSpacing:"0.1em",textTransform:"uppercase",color:C.muted,marginBottom:"5px",fontWeight:"500"}}>🇬🇧 Word-for-word</div><div style={{fontFamily:"Georgia,serif",fontSize:"14px",color:C.muted,lineHeight:1.65,fontStyle:"italic"}}>{seg.en}</div></div>
        </div>
        {showNotes&&seg.note&&<div style={{background:C.softGold,borderRadius:"8px",padding:"7px 11px",borderLeft:`3px solid ${C.gold}`,marginTop:"8px"}}><span style={{fontSize:"11px",color:C.ochre}}>💡 {seg.note}</span></div>}
        <button onClick={()=>playSegment(seg,activeText,i)} style={{marginTop:"9px",background:isPlaying?C.red:isHighlit?text.levelColor:"transparent",border:`0.5px solid ${isPlaying?C.red:isHighlit?text.levelColor:C.border}`,borderRadius:"8px",padding:"6px 13px",color:isPlaying||isHighlit?C.onDark:C.muted,fontSize:"12px",cursor:"pointer",display:"flex",alignItems:"center",gap:"5px",transition:"all 0.15s"}}>{isPlaying?"🔊 Playing...":"🔊 Hear in European Portuguese"}{wasRead&&!isPlaying&&<span style={{color:C.green,fontSize:"11px"}}>✓</span>}</button>
      </div>);})}
      {(readerData.completed||{})[activeText]&&<div style={{background:C.softGreen,border:`0.5px solid ${C.green}`,borderRadius:"12px",padding:"13px",textAlign:"center",marginTop:"7px"}}><div style={{fontSize:"20px",marginBottom:"3px"}}>🎉</div><div style={{fontSize:"14px",fontWeight:"500",color:C.green}}>Text completed! Saved.</div></div>}
    </div>);
  }
  const cats=[{id:"all",label:"All texts"},{id:"folk",label:"🐓 Folk Stories"},{id:"gospel",label:"📘 Preach My Gospel"},{id:"scripture",label:"📜 Scriptures"},{id:"daily",label:"🌅 Daily Use"}];
  const visible=catFilter==="all"?READER_TEXTS:READER_TEXTS.filter(t=>t.category===catFilter);
  return(<div style={{padding:"1.5rem 0"}}>
    <div style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:"12px",padding:"12px 16px",marginBottom:"14px",display:"flex",gap:"18px"}}>
      <div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}><span style={{fontSize:"12px",color:C.muted}}>Texts completed</span><span style={{fontSize:"12px",fontWeight:"500",color:C.portWine}}>{completedCount}/{READER_TEXTS.length}</span></div><div style={{height:"6px",background:C.border,borderRadius:"3px",overflow:"hidden"}}><div style={{width:`${(completedCount/READER_TEXTS.length)*100}%`,height:"100%",background:C.portWine,borderRadius:"3px"}}/></div></div>
      <div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}><span style={{fontSize:"12px",color:C.muted}}>Segments heard</span><span style={{fontSize:"12px",fontWeight:"500",color:C.douro}}>{segmentsRead}</span></div><div style={{height:"6px",background:C.border,borderRadius:"3px",overflow:"hidden"}}><div style={{width:`${Math.min((segmentsRead/40)*100,100)}%`,height:"100%",background:C.douro,borderRadius:"3px"}}/></div></div>
    </div>
    <p style={{fontSize:"13px",color:C.muted,lineHeight:1.7,marginBottom:"13px"}}>Each text shows Portuguese on the left and a <strong style={{color:C.ink}}>word-for-word</strong> English translation on the right — literal, not grammatical. This reveals how Portuguese sentence structure works and is one of the most powerful ways to build fluency.</p>
    <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"16px"}}>{cats.map(c=>(<button key={c.id} onClick={()=>setCatFilter(c.id)} style={{padding:"7px 13px",borderRadius:"10px",fontSize:"12px",cursor:"pointer",border:catFilter===c.id?"none":`0.5px solid ${C.border}`,background:catFilter===c.id?C.douro:"transparent",color:catFilter===c.id?C.onDark:C.muted}}>{c.label}</button>))}</div>
    <div style={{display:"flex",flexDirection:"column",gap:"9px"}}>
      {visible.map(text=>{const completed=!!(readerData.completed||{})[text.id];const segsRead=Object.keys(readerData.progress||{}).filter(k=>k.startsWith(text.id)).length;const pct=Math.round((segsRead/text.segments.length)*100);return(<button key={text.id} onClick={()=>setActiveText(text.id)} style={{background:completed?C.softGreen:C.surface,border:`0.5px solid ${completed?C.green:C.border}`,borderRadius:"14px",padding:"16px",cursor:"pointer",textAlign:"left",position:"relative",overflow:"hidden"}}><AzPat size={70} opacity={0.05}/><div style={{display:"flex",gap:"11px",alignItems:"flex-start",position:"relative"}}><div style={{width:"44px",height:"44px",borderRadius:"10px",flexShrink:0,background:text.levelColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"19px",boxShadow:`0 2px 8px ${text.levelColor}44`}}>{text.icon}</div><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",gap:"8px"}}><div style={{fontFamily:"Georgia,serif",fontSize:"15px",color:C.ink}}>{text.title}</div>{completed&&<span style={{fontSize:"13px",flexShrink:0}}>✅</span>}</div><div style={{fontSize:"12px",color:C.muted,marginBottom:"7px"}}>{text.subtitle}</div><div style={{display:"flex",gap:"7px",alignItems:"center",flexWrap:"wrap"}}><span style={{fontSize:"11px",background:text.levelColor+"22",color:text.levelColor,padding:"2px 7px",borderRadius:"7px",border:`0.5px solid ${text.levelColor}44`}}>{text.level}</span><span style={{fontSize:"11px",color:C.faint}}>{text.segments.length} segments</span>{segsRead>0&&<span style={{fontSize:"11px",color:completed?C.green:C.terra}}>{pct}% read</span>}</div>{segsRead>0&&<div style={{height:"4px",background:C.border,borderRadius:"2px",overflow:"hidden",marginTop:"7px"}}><div style={{width:`${pct}%`,height:"100%",background:completed?C.green:text.levelColor,borderRadius:"2px",transition:"width 0.5s"}}/></div>}</div></div></button>);})}
    </div>
  </div>);
}

// ══════════════════════════════════════════════════════════════════════════════
//  ROOT APP — ALL 5 TABS

// ══════════════════════════════════════════════════════════════════════════════
//  VOCAB VIEW — Flashcard + Quiz modes
// ══════════════════════════════════════════════════════════════════════════════
function VocabView({vocabData,saveVocabData}){
  const [cat,setCat]       = useState("numbers");
  const [mode,setMode]     = useState("flash");   // flash | quiz
  const [cardIdx,setCardIdx]= useState(0);
  const [flipped,setFlipped]= useState(false);
  const [quizState,setQuizState]= useState(null); // {q, opts, chosen, correct}
  const [playing,setPlaying]= useState(null);

  const activeCat = VOCAB_CATS.find(c=>c.id===cat);
  const heardMap  = vocabData.heard||{};
  const correctMap= vocabData.correct||{};

  const heardCount   = Object.keys(heardMap).length;
  const totalWords   = VOCAB_CATS.reduce((a,c)=>a+c.words.length,0);
  const correctCount = Object.keys(correctMap).length;

  const logHeard=(key)=>{
    const h={...heardMap}; h[key]=(h[key]||0)+1;
    saveVocabData({...vocabData,heard:h});
  };
  const logCorrect=(key)=>{
    const c={...correctMap}; c[key]=true;
    saveVocabData({...vocabData,correct:c});
  };

  const playWord=(pt,key)=>{
    setPlaying(key);
    speakPT(pt,0.78);
    logHeard(key);
    setTimeout(()=>setPlaying(null),1400);
  };

  // ── Flashcard mode ──
  const word    = activeCat.words[cardIdx];
  const wordKey = `${cat}-${cardIdx}`;
  const wasHeard   = (heardMap[wordKey]||0)>0;
  const wasCorrect = !!correctMap[wordKey];

  const nextCard=()=>{ setCardIdx((cardIdx+1)%activeCat.words.length); setFlipped(false); };
  const prevCard=()=>{ setCardIdx((cardIdx-1+activeCat.words.length)%activeCat.words.length); setFlipped(false); };

  // ── Quiz mode helpers ──
  const buildQuiz=(words,idx)=>{
    const correct=words[idx];
    const pool=words.filter((_,i)=>i!==idx);
    const opts=[correct,...pool.sort(()=>Math.random()-0.5).slice(0,3)].sort(()=>Math.random()-0.5);
    return{q:correct,opts,chosen:null,correct:correct.en};
  };

  const startQuiz=()=>{
    setMode("quiz");
    setQuizState(buildQuiz(activeCat.words, Math.floor(Math.random()*activeCat.words.length)));
  };

  const chooseAnswer=(opt)=>{
    if(quizState.chosen) return;
    const isRight=opt.en===quizState.correct;
    const qIdx=activeCat.words.indexOf(quizState.q);
    const key=`${cat}-${qIdx}`;
    logHeard(key);
    if(isRight) logCorrect(key);
    setQuizState({...quizState,chosen:opt.en});
    speakPT(quizState.q.pt,0.8);
  };

  const nextQuiz=()=>setQuizState(buildQuiz(activeCat.words,Math.floor(Math.random()*activeCat.words.length)));

  return(
    <div style={{padding:"1.5rem 0"}}>
      {/* Overall progress */}
      <div style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:"12px",
                   padding:"12px 16px",marginBottom:"14px",display:"flex",gap:"18px"}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
            <span style={{fontSize:"12px",color:C.muted}}>Words heard</span>
            <span style={{fontSize:"12px",fontWeight:"500",color:C.terra}}>{heardCount}/{totalWords}</span>
          </div>
          <div style={{height:"6px",background:C.border,borderRadius:"3px",overflow:"hidden"}}>
            <div style={{width:`${(heardCount/totalWords)*100}%`,height:"100%",background:C.terra,borderRadius:"3px",transition:"width 0.5s"}}/>
          </div>
        </div>
        <div style={{flex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
            <span style={{fontSize:"12px",color:C.muted}}>Quiz correct</span>
            <span style={{fontSize:"12px",fontWeight:"500",color:C.green}}>{correctCount}/{totalWords}</span>
          </div>
          <div style={{height:"6px",background:C.border,borderRadius:"3px",overflow:"hidden"}}>
            <div style={{width:`${(correctCount/totalWords)*100}%`,height:"100%",background:C.green,borderRadius:"3px",transition:"width 0.5s"}}/>
          </div>
        </div>
      </div>

      {/* Category selector */}
      <div style={{display:"flex",gap:"5px",flexWrap:"wrap",marginBottom:"14px"}}>
        {VOCAB_CATS.map(c=>{
          const catHeard=c.words.filter((_,i)=>(heardMap[`${c.id}-${i}`]||0)>0).length;
          return(<button key={c.id} onClick={()=>{setCat(c.id);setCardIdx(0);setFlipped(false);setMode("flash");setQuizState(null);}}
            style={{padding:"7px 12px",borderRadius:"10px",fontSize:"12px",cursor:"pointer",
                    border:cat===c.id?"none":`0.5px solid ${C.border}`,
                    background:cat===c.id?c.color:"transparent",
                    color:cat===c.id?C.onDark:C.muted,fontWeight:cat===c.id?"500":"400",
                    display:"flex",alignItems:"center",gap:"5px"}}>
            <span>{c.icon}</span>{c.label}
            {catHeard>0&&<span style={{fontSize:"10px",background:cat===c.id?"rgba(255,255,255,0.2)":C.softGold,
                                        padding:"1px 5px",borderRadius:"8px",color:cat===c.id?C.onDark:C.ochre}}>
              {catHeard}/{c.words.length}
            </span>}
          </button>);
        })}
      </div>

      {/* Mode toggle */}
      <div style={{display:"flex",gap:"6px",marginBottom:"18px"}}>
        <button onClick={()=>{setMode("flash");setCardIdx(0);setFlipped(false);}}
          style={{flex:1,padding:"9px",borderRadius:"10px",fontSize:"13px",cursor:"pointer",border:"none",
                  background:mode==="flash"?activeCat.color:C.surface,
                  color:mode==="flash"?C.onDark:C.muted,fontWeight:mode==="flash"?"500":"400",
                  border:mode==="flash"?"none":`0.5px solid ${C.border}`}}>
          🃏 Flashcards
        </button>
        <button onClick={startQuiz}
          style={{flex:1,padding:"9px",borderRadius:"10px",fontSize:"13px",cursor:"pointer",border:"none",
                  background:mode==="quiz"?activeCat.color:C.surface,
                  color:mode==="quiz"?C.onDark:C.muted,fontWeight:mode==="quiz"?"500":"400",
                  border:mode==="quiz"?"none":`0.5px solid ${C.border}`}}>
          🎯 Quiz
        </button>
      </div>

      {/* ── FLASHCARD MODE ── */}
      {mode==="flash"&&(
        <>
          {/* Card progress */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
            <span style={{fontSize:"12px",color:C.faint}}>{activeCat.label} · {cardIdx+1} of {activeCat.words.length}</span>
            <div style={{display:"flex",gap:"3px"}}>
              {activeCat.words.map((_,i)=>(
                <div key={i} style={{width:"8px",height:"8px",borderRadius:"50%",
                                     background:i===cardIdx?activeCat.color:(heardMap[`${cat}-${i}`]?C.green:C.border)}}/>
              ))}
            </div>
          </div>

          {/* Flashcard */}
          <div onClick={()=>{setFlipped(!flipped);if(!flipped)logHeard(wordKey);}}
            style={{background:flipped?activeCat.color:C.surface,
                    border:`0.5px solid ${flipped?activeCat.color:C.border}`,
                    borderRadius:"20px",padding:"40px 24px",textAlign:"center",
                    cursor:"pointer",minHeight:"180px",display:"flex",flexDirection:"column",
                    alignItems:"center",justifyContent:"center",marginBottom:"16px",
                    position:"relative",overflow:"hidden",
                    boxShadow:flipped?`0 4px 20px ${activeCat.color}44`:"none",
                    transition:"background 0.2s, box-shadow 0.2s"}}>
            <AzPat size={100} opacity={0.06}/>
            {!flipped?(
              <>
                <div style={{fontFamily:"Georgia,serif",fontSize:"36px",color:activeCat.color,marginBottom:"10px"}}>
                  {word.pt}
                </div>
                <div style={{fontSize:"12px",color:C.faint}}>Tap to reveal English</div>
                {wasHeard&&<div style={{position:"absolute",top:"10px",right:"12px",fontSize:"11px",color:C.green}}>heard ×{heardMap[wordKey]}</div>}
                {wasCorrect&&<div style={{position:"absolute",top:"10px",left:"12px",fontSize:"13px"}}>✅</div>}
              </>
            ):(
              <>
                <div style={{fontFamily:"Georgia,serif",fontSize:"28px",color:C.onDark,marginBottom:"8px"}}>{word.en}</div>
                <div style={{fontFamily:"Georgia,serif",fontSize:"20px",color:"rgba(248,242,228,0.65)",marginBottom:"16px"}}>{word.pt}</div>
                <button onClick={(e)=>{e.stopPropagation();playWord(word.pt,wordKey);}}
                  style={{background:"rgba(255,255,255,0.15)",border:`0.5px solid rgba(255,255,255,0.3)`,
                          borderRadius:"9px",padding:"7px 16px",color:C.onDark,fontSize:"13px",cursor:"pointer"}}>
                  {playing===wordKey?"🔊 Playing...":"🔊 Hear in European Portuguese"}
                </button>
              </>
            )}
          </div>

          {/* Navigation */}
          <div style={{display:"flex",gap:"8px"}}>
            <button onClick={prevCard}
              style={{flex:1,padding:"10px",borderRadius:"10px",border:`0.5px solid ${C.border}`,
                      background:"transparent",color:C.muted,fontSize:"14px",cursor:"pointer"}}>
              ← Previous
            </button>
            <button onClick={()=>playWord(word.pt,wordKey)}
              style={{padding:"10px 14px",borderRadius:"10px",border:"none",
                      background:activeCat.color,color:C.onDark,fontSize:"14px",cursor:"pointer"}}>
              🔊
            </button>
            <button onClick={nextCard}
              style={{flex:1,padding:"10px",borderRadius:"10px",border:"none",
                      background:activeCat.color,color:C.onDark,fontSize:"14px",cursor:"pointer",fontWeight:"500"}}>
              Next →
            </button>
          </div>
        </>
      )}

      {/* ── QUIZ MODE ── */}
      {mode==="quiz"&&quizState&&(
        <div>
          <div style={{background:activeCat.color,borderRadius:"18px",padding:"28px 24px",
                       marginBottom:"16px",textAlign:"center",position:"relative",overflow:"hidden",
                       boxShadow:`0 4px 20px ${activeCat.color}44`}}>
            <AzPat size={100} opacity={0.1}/>
            <div style={{fontSize:"12px",color:"rgba(248,242,228,0.65)",marginBottom:"10px",
                         letterSpacing:"0.12em",textTransform:"uppercase"}}>What is the English meaning?</div>
            <div style={{fontFamily:"Georgia,serif",fontSize:"34px",color:C.onDark,marginBottom:"6px"}}>
              {quizState.q.pt}
            </div>
            {quizState.chosen&&(
              <button onClick={()=>{const i=activeCat.words.indexOf(quizState.q);playWord(quizState.q.pt,`${cat}-${i}`);}}
                style={{marginTop:"8px",background:"rgba(255,255,255,0.15)",border:`0.5px solid rgba(255,255,255,0.3)`,
                        borderRadius:"9px",padding:"6px 14px",color:C.onDark,fontSize:"12px",cursor:"pointer"}}>
                🔊 Hear it
              </button>
            )}
          </div>

          {/* Answer options */}
          <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"14px"}}>
            {quizState.opts.map((opt,i)=>{
              const isChosen = quizState.chosen===opt.en;
              const isCorrect= opt.en===quizState.correct;
              const revealed = !!quizState.chosen;
              let bg=C.surface, border=`0.5px solid ${C.border}`, color=C.ink;
              if(revealed&&isCorrect){bg=C.softGreen;border=`1.5px solid ${C.green}`;color=C.green;}
              else if(revealed&&isChosen&&!isCorrect){bg=C.softRed;border=`1.5px solid ${C.red}`;color=C.red;}
              return(
                <button key={i} onClick={()=>chooseAnswer(opt)} disabled={!!quizState.chosen}
                  style={{background:bg,border,borderRadius:"12px",padding:"14px 18px",
                          color,fontSize:"14px",cursor:quizState.chosen?"default":"pointer",
                          textAlign:"left",fontFamily:"Georgia,serif",
                          display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span>{opt.en}</span>
                  {revealed&&isCorrect&&<span style={{fontSize:"16px"}}>✅</span>}
                  {revealed&&isChosen&&!isCorrect&&<span style={{fontSize:"16px"}}>❌</span>}
                </button>
              );
            })}
          </div>

          {quizState.chosen&&(
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:"14px",color:quizState.chosen===quizState.correct?C.green:C.terra,
                           marginBottom:"12px",fontWeight:"500"}}>
                {quizState.chosen===quizState.correct?"🎉 Correct! Saved to your progress.":"Keep going — you'll get it next time!"}
              </div>
              <button onClick={nextQuiz}
                style={{background:activeCat.color,border:"none",borderRadius:"11px",
                        padding:"12px 28px",color:C.onDark,fontSize:"14px",fontWeight:"500",cursor:"pointer"}}>
                Next question →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
//  SPEAKING LAB — Real microphone waveform + speech recognition
// ══════════════════════════════════════════════════════════════════════════════
function SpeakingLabView({speakingData,saveSpeakingData}){
  const [level,setLevel]       = useState("sounds");
  const [activeEx,setActiveEx] = useState(null);
  const [phase,setPhase]       = useState("idle"); // idle|playing|recording|done
  const [transcript,setTranscript]= useState("");
  const [score,setScore]       = useState(null);

  const nativeRef  = useRef(null);
  const userRef    = useRef(null);
  const analyserRef= useRef(null);
  const streamRef  = useRef(null);
  const animRef    = useRef(null);
  const recRef     = useRef(null);

  const activeLevel = SPEAK_LEVELS.find(l=>l.id===level);
  const scoresMap   = speakingData.scores||{};
  const sessions    = speakingData.sessions||0;
  const practicedCount = Object.keys(scoresMap).length;
  const totalEx = SPEAK_LEVELS.reduce((a,l)=>a+l.exercises.length,0);

  const logScore=(id,sc)=>{
    const s={...scoresMap}; s[id]=Math.max(s[id]||0,sc);
    saveSpeakingData({...speakingData,scores:s,sessions:(speakingData.sessions||0)+1});
  };

  // Draw animated "native" waveform on canvas
  const startNativeAnim=(canvas)=>{
    if(!canvas) return;
    const ctx=canvas.getContext("2d"); const W=canvas.width; const H=canvas.height;
    let t=0;
    const draw=()=>{
      animRef.current=requestAnimationFrame(draw);
      ctx.clearRect(0,0,W,H);
      const bars=28; const bw=(W/(bars+1))-1;
      for(let i=0;i<bars;i++){
        const envelope=(Math.sin(i/bars*Math.PI)*0.5+0.5);
        const wave=Math.sin(i*0.5+t)*0.3+Math.sin(i*0.9+t*1.4)*0.2+0.5;
        const h=envelope*wave*H*0.85;
        ctx.fillStyle=C.green;
        ctx.globalAlpha=0.85;
        ctx.fillRect(i*(bw+1),H/2-h/2,bw,Math.max(2,h));
      }
      ctx.globalAlpha=1;
      t+=0.1;
    };
    draw();
  };

  // Draw real mic waveform
  const startUserAnim=(canvas,analyser)=>{
    if(!canvas||!analyser) return;
    const ctx=canvas.getContext("2d"); const W=canvas.width; const H=canvas.height;
    const bufLen=analyser.frequencyBinCount;
    const data=new Uint8Array(bufLen);
    const step=Math.floor(bufLen/28);
    const draw=()=>{
      animRef.current=requestAnimationFrame(draw);
      analyser.getByteFrequencyData(data);
      ctx.clearRect(0,0,W,H);
      const bars=28; const bw=(W/(bars+1))-1;
      for(let i=0;i<bars;i++){
        const avg=data.slice(i*step,(i+1)*step).reduce((a,b)=>a+b,0)/step;
        const h=Math.max(2,(avg/255)*H*0.9);
        ctx.fillStyle=C.terra;
        ctx.globalAlpha=0.9;
        ctx.fillRect(i*(bw+1),H/2-h/2,bw,h);
      }
      ctx.globalAlpha=1;
    };
    draw();
  };

  const stopAnim=()=>{ cancelAnimationFrame(animRef.current); };

  const drawStaticBars=(canvas,color,filled)=>{
    if(!canvas) return;
    const ctx=canvas.getContext("2d"); const W=canvas.width; const H=canvas.height;
    ctx.clearRect(0,0,W,H);
    const bars=28; const bw=(W/(bars+1))-1;
    if(!filled){ctx.fillStyle=C.border;for(let i=0;i<bars;i++)ctx.fillRect(i*(bw+1),H/2-4,bw,8);return;}
    for(let i=0;i<bars;i++){
      const h=Math.max(3,(Math.sin(i/bars*Math.PI)*0.5+Math.sin(i*0.6)*0.3+0.4)*H*0.8);
      ctx.fillStyle=color; ctx.globalAlpha=0.5;
      ctx.fillRect(i*(bw+1),H/2-h/2,bw,h);
    }
    ctx.globalAlpha=1;
  };

  const playNative=(ex)=>{
    stopAnim();
    setPhase("playing"); setScore(null); setTranscript("");
    setTimeout(()=>startNativeAnim(nativeRef.current),50);
    drawStaticBars(userRef.current,C.terra,false);
    speakPT(ex.pt,0.78);
    const dur=Math.max(2200,ex.pt.length*95);
    setTimeout(()=>{stopAnim();drawStaticBars(nativeRef.current,C.green,true);setPhase("idle");},dur);
  };

  const startRecord=async(ex)=>{
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      streamRef.current=stream;
      const audioCtx=new(window.AudioContext||window.webkitAudioContext)();
      const source=audioCtx.createMediaStreamSource(stream);
      const analyser=audioCtx.createAnalyser(); analyser.fftSize=128;
      source.connect(analyser); analyserRef.current=analyser;
      stopAnim();
      setPhase("recording"); setTranscript(""); setScore(null);
      setTimeout(()=>startUserAnim(userRef.current,analyser),50);

      const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
      if(!SR){setTranscript("Speech recognition needs Chrome or Edge.");stopRecord();return;}
      const rec=new SR(); rec.lang="pt-PT"; rec.continuous=false; rec.interimResults=false;
      recRef.current=rec;
      rec.onresult=(e)=>{
        const said=e.results[0][0].transcript;
        setTranscript(said);
        const cl=s=>s.toLowerCase().replace(/[.,!?;:]/g,"").trim();
        const tW=cl(ex.pt).split(" "); const gW=cl(said).split(" ");
        const mt=tW.filter(w=>gW.some(g=>g.includes(w.slice(0,4))||w.includes(g.slice(0,4)))).length;
        const sc=Math.round((mt/tW.length)*100); setScore(sc); logScore(ex.id,sc);
      };
      rec.onerror=()=>stopRecord(); rec.onend=()=>stopRecord();
      rec.start();
    }catch(e){
      setPhase("idle");
      setTranscript("Microphone access needed — allow it in your browser settings.");
    }
  };

  const stopRecord=()=>{
    stopAnim();
    drawStaticBars(userRef.current,C.terra,true);
    if(streamRef.current){streamRef.current.getTracks().forEach(t=>t.stop());streamRef.current=null;}
    recRef.current?.stop(); setPhase("done");
  };

  const selectEx=(ex)=>{
    stopRecord(); stopAnim();
    setActiveEx(ex); setPhase("idle"); setScore(null); setTranscript("");
    drawStaticBars(nativeRef.current,C.green,false);
    drawStaticBars(userRef.current,C.terra,false);
  };

  // Init canvases on mount
  useEffect(()=>{
    const init=()=>{
      drawStaticBars(nativeRef.current,C.green,false);
      drawStaticBars(userRef.current,C.terra,false);
    };
    setTimeout(init,100);
    return()=>{stopAnim();streamRef.current?.getTracks().forEach(t=>t.stop());};
  },[]);

  return(
    <div style={{padding:"1.5rem 0"}}>
      {/* Stats bar */}
      <div style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:"12px",
                   padding:"12px 16px",marginBottom:"16px",display:"flex",gap:"20px",alignItems:"center"}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}>
            <span style={{fontSize:"12px",color:C.muted}}>Exercises practiced</span>
            <span style={{fontSize:"12px",fontWeight:"500",color:C.terra}}>{practicedCount}/{totalEx}</span>
          </div>
          <div style={{height:"6px",background:C.border,borderRadius:"3px",overflow:"hidden"}}>
            <div style={{width:`${(practicedCount/totalEx)*100}%`,height:"100%",background:C.terra,borderRadius:"3px"}}/>
          </div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{fontSize:"10px",color:C.faint,textTransform:"uppercase",letterSpacing:"0.08em"}}>Total sessions</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:"22px",color:C.douro}}>{sessions}</div>
        </div>
      </div>

      {/* Level selector */}
      <div style={{display:"flex",gap:"5px",flexWrap:"wrap",marginBottom:"16px"}}>
        {SPEAK_LEVELS.map(l=>(
          <button key={l.id} onClick={()=>{setLevel(l.id);setActiveEx(null);setPhase("idle");setScore(null);setTranscript("");}}
            style={{padding:"7px 13px",borderRadius:"10px",fontSize:"12px",cursor:"pointer",
                    border:level===l.id?"none":`0.5px solid ${C.border}`,
                    background:level===l.id?l.color:"transparent",
                    color:level===l.id?C.onDark:C.muted,fontWeight:level===l.id?"500":"400"}}>
            {l.label} · <span style={{opacity:0.8}}>{l.sublabel}</span>
          </button>
        ))}
      </div>

      {/* Info banner */}
      <div style={{background:C.softBlue,border:`0.5px solid ${C.azulejo}22`,borderLeft:`3px solid ${C.azulejo}`,
                   borderRadius:"10px",padding:"10px 14px",marginBottom:"16px",fontSize:"12px",color:C.azulejo}}>
        <strong>How it works:</strong> Select an exercise below. Hit 🔊 to hear it in European Portuguese.
        Watch the green waveform. Then hit 🎤 to record — your waveform appears in orange beside it.
        See a live score. Repeat until it feels natural.
      </div>

      {/* Exercise list */}
      <div style={{display:"flex",flexDirection:"column",gap:"7px",marginBottom:"16px"}}>
        {activeLevel.exercises.map(ex=>{
          const best=scoresMap[ex.id];
          const mastered=best&&best>=80;
          const isActive=activeEx?.id===ex.id;
          return(
            <button key={ex.id} onClick={()=>selectEx(ex)}
              style={{background:isActive?activeLevel.color:mastered?C.softGreen:C.surface,
                      border:isActive?"none":mastered?`0.5px solid ${C.green}`:`0.5px solid ${C.border}`,
                      borderRadius:"12px",padding:"12px 16px",cursor:"pointer",textAlign:"left",
                      display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontFamily:"Georgia,serif",fontSize:"16px",
                             color:isActive?C.onDark:mastered?C.green:C.ink,marginBottom:"2px"}}>
                  {ex.pt}
                </div>
                <div style={{fontSize:"11px",color:isActive?"rgba(248,242,228,0.65)":C.faint}}>{ex.hint}</div>
              </div>
              <div style={{flexShrink:0,textAlign:"right",marginLeft:"10px"}}>
                {mastered&&<div style={{fontSize:"13px"}}>⭐</div>}
                {best&&<div style={{fontSize:"11px",color:isActive?"rgba(248,242,228,0.65)":mastered?C.green:C.terra,
                                    fontWeight:"500"}}>best {best}%</div>}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Active exercise panel ── */}
      {activeEx&&(
        <div style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:"18px",
                     padding:"20px",borderTop:`3px solid ${activeLevel.color}`}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:"18px",color:C.ink,marginBottom:"4px"}}>{activeEx.pt}</div>
          <div style={{fontSize:"12px",color:C.faint,marginBottom:"18px"}}>{activeEx.hint}</div>

          {/* Dual waveform display */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"16px"}}>
            <div>
              <div style={{fontSize:"10px",letterSpacing:"0.1em",textTransform:"uppercase",
                           color:C.green,marginBottom:"5px",fontWeight:"500"}}>🇵🇹 Native (European Portuguese)</div>
              <canvas ref={nativeRef} width={280} height={70}
                style={{width:"100%",height:"70px",background:C.bg,borderRadius:"8px",
                        border:`0.5px solid ${C.border}`,display:"block"}}/>
            </div>
            <div>
              <div style={{fontSize:"10px",letterSpacing:"0.1em",textTransform:"uppercase",
                           color:C.terra,marginBottom:"5px",fontWeight:"500"}}>🎤 Your voice</div>
              <canvas ref={userRef} width={280} height={70}
                style={{width:"100%",height:"70px",background:C.bg,borderRadius:"8px",
                        border:`0.5px solid ${C.border}`,display:"block"}}/>
            </div>
          </div>

          {/* Controls */}
          <div style={{display:"flex",gap:"8px",marginBottom:"14px"}}>
            <button onClick={()=>playNative(activeEx)} disabled={phase==="recording"||phase==="playing"}
              style={{flex:1,background:phase==="playing"?C.green:C.surface,
                      border:`0.5px solid ${phase==="playing"?C.green:C.border}`,
                      borderRadius:"10px",padding:"11px",color:phase==="playing"?C.onDark:C.green,
                      fontSize:"13px",cursor:"pointer",fontWeight:"500",transition:"all 0.2s"}}>
              {phase==="playing"?"🔊 Playing...":"🔊 Hear native"}
            </button>
            <button onClick={()=>phase==="recording"?stopRecord():startRecord(activeEx)}
              disabled={phase==="playing"}
              style={{flex:1,background:phase==="recording"?C.red:C.surface,
                      border:`0.5px solid ${phase==="recording"?C.red:C.border}`,
                      borderRadius:"10px",padding:"11px",color:phase==="recording"?C.onDark:C.terra,
                      fontSize:"13px",cursor:"pointer",fontWeight:"500",transition:"all 0.2s"}}>
              {phase==="recording"?"⏹ Stop recording":"🎤 Record yourself"}
            </button>
          </div>

          {/* Transcript + Score */}
          {transcript&&(
            <div style={{background:score&&score>=80?C.softGreen:C.softGold,borderRadius:"12px",padding:"14px",
                         border:`0.5px solid ${C.border}`}}>
              <div style={{fontSize:"10px",letterSpacing:"0.1em",textTransform:"uppercase",
                           color:C.muted,marginBottom:"5px"}}>You said</div>
              <div style={{fontFamily:"Georgia,serif",fontSize:"15px",color:C.ink,marginBottom:"10px"}}>{transcript}</div>
              {score!==null&&(
                <>
                  <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"4px"}}>
                    <div style={{flex:1,height:"8px",background:C.border,borderRadius:"4px",overflow:"hidden"}}>
                      <div style={{width:`${score}%`,height:"100%",borderRadius:"4px",
                                   background:score>=80?C.green:score>=50?C.gold:C.red,
                                   transition:"width 0.7s ease"}}/>
                    </div>
                    <span style={{fontFamily:"Georgia,serif",fontSize:"20px",fontWeight:"500",minWidth:"44px",
                                  color:score>=80?C.green:score>=50?C.ochre:C.red}}>{score}%</span>
                  </div>
                  <div style={{fontSize:"13px",fontWeight:"500",
                               color:score>=80?C.green:score>=50?C.ochre:C.red}}>
                    {score>=80?"🎉 Excellent pronunciation! Exercise mastered.":
                     score>=50?"👍 Good — hear it once more then try again!":
                     "🔄 Listen carefully to the native audio, then retry."}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
//  LEARNING PATH VIEW — Readiness score + curriculum + today's session
// ══════════════════════════════════════════════════════════════════════════════
function LearningPathView({streak,alphaData,phraseData,vocabData,cultureData,readerData,speakingData,setTab}){
  const r = calcReadiness(alphaData,phraseData,vocabData,cultureData,readerData,speakingData);
  const t = useCountdown("2026-10-28T09:00:00");

  // Today's recommended activities — based on what's weakest
  const recommendations = [];
  if((r.lettersMastered||0)<26) recommendations.push({icon:"🔡",text:"Practice 3 letters in the Alphabet tab — focus on E, S, and R (the trickiest pt-PT sounds)",tab:"alphabet",color:C.green});
  if((r.phrasesMastered||0)<5)  recommendations.push({icon:"🙏",text:"Master your first 5 missionary phrases — start with the Greetings category",tab:"phrases",color:C.azulejo});
  if((r.vocabHeard||0)<12)      recommendations.push({icon:"📚",text:"Flip through the Família e Casa flashcard set — these words come up in every lesson",tab:"vocab",color:C.portWine});
  if((r.cultureRead||0)<2)      recommendations.push({icon:"🏛",text:"Read the Porto and Azulejos culture topics — they open conversation doors immediately",tab:"culture",color:C.douro});
  if((r.textsCompleted||0)<1)   recommendations.push({icon:"📖",text:"Complete your first parallel reading — João 3:16 is short and powerful",tab:"reader",color:C.terra});
  if((r.speakPracticed||0)<4)   recommendations.push({icon:"🎤",text:"Record 4 exercises in Nível 1 of the Speaking Lab — nail the LH and NH sounds first",tab:"speaking",color:C.ochre});
  if(recommendations.length===0) recommendations.push({icon:"🏆",text:"Amazing progress! Keep your streak alive and work on Advanced speaking exercises today.",tab:"speaking",color:C.gold});
  const todayRecs = recommendations.slice(0,3);

  // 12-week curriculum
  const CURRICULUM = [
    {weeks:"1–2",title:"Foundation — Sound & Greeting",
     items:["alphabet","phrases-greetings","culture-porto"],
     checks:[r.lettersMastered>=20,(r.phrasesMastered||0)>=4,(r.cultureRead||0)>=1]},
    {weeks:"3–4",title:"Identity — Who She Is",
     items:["phrases-intro","culture-azulejos","reader-joao316","reader-oracaomanha"],
     checks:[(r.phrasesMastered||0)>=8,(r.cultureRead||0)>=2,(r.textsCompleted||0)>=1,(r.textsCompleted||0)>=2]},
    {weeks:"5–6",title:"The Message — What She Teaches",
     items:["phrases-teaching","phrases-prayer","culture-fado","reader-galo"],
     checks:[(r.phrasesMastered||0)>=15,(r.phrasesMastered||0)>=20,(r.cultureRead||0)>=3,(r.textsCompleted||0)>=3]},
    {weeks:"7–8",title:"Vocabulary & Daily Life",
     items:["vocab-food","vocab-transport","speaking-basic","culture-saojoao"],
     checks:[(r.vocabHeard||0)>=24,(r.vocabHeard||0)>=48,(r.speakPracticed||0)>=8,(r.cultureRead||0)>=4]},
    {weeks:"9–10",title:"Scripture & Gospel Language",
     items:["reader-pmg1","reader-2ne3120","culture-stories","vocab-gospel"],
     checks:[(r.textsCompleted||0)>=4,(r.textsCompleted||0)>=5,(r.cultureRead||0)>=5,(r.vocabHeard||0)>=72]},
    {weeks:"11–12",title:"Full Discussion Practice",
     items:["speaking-mission","speaking-scripture","vocab-all","review-all"],
     checks:[(r.speakPracticed||0)>=16,(r.speakPracticed||0)>=24,(r.vocabHeard||0)>=90,r.total>=80]},
  ];

  const weeksDone = CURRICULUM.filter(w=>w.checks.filter(Boolean).length>=Math.floor(w.checks.length*0.75)).length;

  return(
    <div style={{padding:"1.5rem 0"}}>

      {/* ── READINESS GAUGE ── */}
      <div style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:"20px",
                   padding:"24px",marginBottom:"18px",textAlign:"center",
                   borderTop:`4px solid ${r.total>=80?C.green:r.total>=50?C.gold:C.terra}`}}>
        <div style={{fontSize:"11px",letterSpacing:"0.18em",textTransform:"uppercase",
                     color:C.faint,marginBottom:"8px"}}>Mission Readiness Score</div>

        {/* Circular gauge */}
        <div style={{position:"relative",width:"140px",height:"140px",margin:"0 auto 14px"}}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="58" fill="none" stroke={C.border} strokeWidth="10"/>
            <circle cx="70" cy="70" r="58" fill="none"
              stroke={r.total>=80?C.green:r.total>=50?C.gold:C.terra} strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${(r.total/100)*364.4} 364.4`}
              transform="rotate(-90 70 70)"/>
            <text x="70" y="64" textAnchor="middle" fontFamily="Georgia,serif"
              fontSize="34" fill={r.total>=80?C.green:r.total>=50?C.ochre:C.terra} fontWeight="400">
              {r.total}%
            </text>
            <text x="70" y="84" textAnchor="middle" fontFamily="Georgia,serif"
              fontSize="12" fill={C.faint}>
              {r.total>=80?"Mission ready!":r.total>=50?"On track":"Getting started"}
            </text>
          </svg>
        </div>

        {/* Score breakdown bars */}
        <div style={{display:"flex",flexDirection:"column",gap:"7px",textAlign:"left"}}>
          {r.breakdown.map(b=>(
            <div key={b.label}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"3px"}}>
                <span style={{fontSize:"12px",color:C.muted}}>{b.label}</span>
                <span style={{fontSize:"12px",fontWeight:"500",color:b.color}}>{b.value} · {b.score}/{b.max}pts</span>
              </div>
              <div style={{height:"5px",background:C.border,borderRadius:"3px",overflow:"hidden"}}>
                <div style={{width:`${(b.score/b.max)*100}%`,height:"100%",background:b.color,borderRadius:"3px",transition:"width 0.6s"}}/>
              </div>
            </div>
          ))}
        </div>

        {/* Days until mission */}
        {!t.done&&(
          <div style={{marginTop:"16px",padding:"10px 14px",background:C.bg,borderRadius:"10px",
                       fontSize:"12px",color:C.muted}}>
            📅 <strong style={{color:C.douro}}>{t.days} days</strong> until October 28th ·
            Target: reach <strong style={{color:C.green}}>80%+</strong> before MTC begins
          </div>
        )}
      </div>

      {/* ── TODAY'S RECOMMENDED STUDY ── */}
      <div style={{marginBottom:"18px"}}>
        <div style={{fontSize:"11px",fontWeight:"500",color:C.faint,textTransform:"uppercase",
                     letterSpacing:"0.07em",marginBottom:"10px"}}>📋 Today's recommended study</div>
        <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
          {todayRecs.map((rec,i)=>(
            <button key={i} onClick={()=>setTab(rec.tab)}
              style={{background:C.surface,border:`0.5px solid ${C.border}`,borderLeft:`4px solid ${rec.color}`,
                      borderRadius:"12px",padding:"13px 16px",cursor:"pointer",textAlign:"left",
                      display:"flex",gap:"12px",alignItems:"flex-start"}}>
              <span style={{fontSize:"22px",flexShrink:0,marginTop:"1px"}}>{rec.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:"13px",color:C.ink,lineHeight:1.55}}>{rec.text}</div>
                <div style={{fontSize:"11px",color:rec.color,marginTop:"4px",fontWeight:"500"}}>
                  Go to {rec.tab} tab →
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── 12-WEEK CURRICULUM ── */}
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
          <div style={{fontSize:"11px",fontWeight:"500",color:C.faint,textTransform:"uppercase",letterSpacing:"0.07em"}}>
            12-week curriculum
          </div>
          <div style={{fontSize:"12px",color:C.green,fontWeight:"500"}}>{weeksDone}/6 weeks on track</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"0"}}>
          {CURRICULUM.map((week,wi)=>{
            const doneChecks=week.checks.filter(Boolean).length;
            const pct=Math.round((doneChecks/week.checks.length)*100);
            const onTrack=pct>=75;
            const isNow=weeksDone===wi;
            return(
              <div key={wi} style={{display:"flex",gap:"0"}}>
                {/* Timeline line + dot */}
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:"32px",flexShrink:0}}>
                  <div style={{width:"14px",height:"14px",borderRadius:"50%",flexShrink:0,
                               background:onTrack?C.green:isNow?C.gold:C.border,
                               border:isNow?`3px solid ${C.gold}`:onTrack?`3px solid ${C.green}`:"none",
                               zIndex:1,marginTop:"12px"}}/>
                  {wi<5&&<div style={{width:"2px",flex:1,background:C.border,minHeight:"20px"}}/>}
                </div>
                {/* Content */}
                <div style={{flex:1,paddingBottom:"14px",paddingLeft:"10px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",
                               paddingTop:"8px"}}>
                    <div>
                      <div style={{fontSize:"10px",color:C.faint,marginBottom:"2px"}}>Weeks {week.weeks}</div>
                      <div style={{fontSize:"13px",fontWeight:"500",color:onTrack?C.green:isNow?C.ochre:C.ink}}>
                        {onTrack?"✓ ":isNow?"→ ":""}{week.title}
                      </div>
                    </div>
                    <div style={{fontSize:"11px",fontWeight:"500",flexShrink:0,marginLeft:"8px",
                                 color:onTrack?C.green:isNow?C.gold:C.faint}}>
                      {pct}%
                    </div>
                  </div>
                  <div style={{height:"4px",background:C.border,borderRadius:"2px",overflow:"hidden",marginTop:"6px"}}>
                    <div style={{width:`${pct}%`,height:"100%",
                                 background:onTrack?C.green:isNow?C.gold:C.terra,
                                 borderRadius:"2px",transition:"width 0.6s"}}/>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── READINESS CERTIFICATE TEASER ── */}
      {r.total>=80?(
        <div style={{background:C.green,borderRadius:"16px",padding:"20px",marginTop:"8px",
                     textAlign:"center",boxShadow:`0 4px 16px ${C.green}44`}}>
          <div style={{fontSize:"28px",marginBottom:"6px"}}>🏆</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:"18px",color:C.onDark,marginBottom:"4px"}}>
            Mission Ready!
          </div>
          <div style={{fontSize:"13px",color:"rgba(248,242,228,0.75)"}}>
            Sister Bennett — you have reached 80%+ readiness. Vai em frente com confiança! 🇵🇹
          </div>
        </div>
      ):(
        <div style={{background:C.softGold,border:`0.5px solid ${C.border}`,borderLeft:`4px solid ${C.gold}`,
                     borderRadius:"12px",padding:"14px",marginTop:"8px"}}>
          <div style={{fontSize:"12px",color:C.ochre,fontWeight:"500",marginBottom:"4px"}}>🎖 Mission Readiness Certificate</div>
          <div style={{fontSize:"12px",color:C.muted,lineHeight:1.6}}>
            Reach 80% readiness before October 28th to unlock your printable Mission Readiness Certificate.
            Currently at <strong style={{color:C.ochre}}>{r.total}%</strong> — {80-r.total} points to go!
          </div>
        </div>
      )}
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
//  PHASE 4 — SCRIPTURE STUDY DATA  (expanded from Preach My Gospel references)
// ══════════════════════════════════════════════════════════════════════════════
const SCRIPTURE_BOOKS = [
  // ── LIVRO DE MÓRMON ───────────────────────────────────────────────────────
  { id:"bom", label:"Livro de Mórmon", sublabel:"Book of Mormon", icon:"📗", color:"#046A38",
    chapters:[
      { ref:"1 Néfi 3:7", topic:"Obediência — I Will Go and Do",
        verses:[{
          pt:"Irei e farei as coisas que o Senhor ordenou, pois sei que o Senhor não dá mandamentos aos filhos dos homens sem preparar-lhes o caminho pelo qual possam cumprir aquilo que lhes ordenou.",
          en:"I will go and do the things which the Lord hath commanded, for I know that the Lord giveth no commandments unto the children of men, save he shall prepare a way for them that they may accomplish the thing which he commandeth them."}]},
      { ref:"2 Néfi 2:25", topic:"A Queda e a Alegria",
        verses:[{
          pt:"Adão caiu para que os homens existissem; e os homens existem para que possam ter alegria.",
          en:"Adam fell that men might be; and men are, that they might have joy."}]},
      { ref:"2 Néfi 9:20–21", topic:"O Poder Infinito de Cristo",
        verses:[{
          pt:"Ó quão grande a santidade de nosso Deus! Pois Ele conhece todas as coisas e não há nada que Ele não saiba.",
          en:"O how great the holiness of our God! For he knoweth all things, and there is not anything save he knows it."},
          {pt:"E Ele vem ao mundo para que possa salvar todos os homens, se ouvirem a Sua voz; pois eis que Ele sofre as dores de todos os homens, sim, as dores de cada criatura vivente.",
          en:"And he cometh into the world that he may save all men if they will hearken unto his voice; for behold, he suffereth the pains of all men, yea, the pains of every living creature."}]},
      { ref:"2 Néfi 25:23", topic:"Graça e Esforço",
        verses:[{
          pt:"Pois sabemos que é pela graça que somos salvos, depois de tudo o que podemos fazer.",
          en:"For we know that it is by grace that we are saved, after all we can do."}]},
      { ref:"2 Néfi 31:17–18", topic:"O Caminho para a Vida Eterna",
        verses:[{
          pt:"Por isso, fazei as coisas que vos disse que vosso Pai ordenou. E isto é a palavra do Pai e a palavra do Filho ao mesmo tempo — arrependei-vos, todos os confins da terra, e vinde a Mim, e sede batizados em Meu nome.",
          en:"Wherefore, do the things which I have told you I have seen that your Father shall do; and this is the word of the Father — repent ye, repent ye, and be baptized in the name of my Beloved Son."},
          {pt:"E agora, eis que Minha bienamada, vou dizer-vos que a porta pela qual deveis entrar é o arrependimento e o batismo em água; e então vem a remissão dos vossos pecados pelo fogo e pelo Espírito Santo.",
          en:"And now, my beloved brethren, after ye have gotten into this strait and narrow path, I would ask if all is done? Behold, I say unto you, Nay; for ye have not come thus far save it were by the word of Christ with unshaken faith in him, relying wholly upon the merits of him who is mighty to save."}]},
      { ref:"2 Néfi 31:20", topic:"Pressionar em Frente",
        verses:[{
          pt:"Assim, amados irmãos e irmãs, ide com perseverança na vereda que leva à vida eterna, depois de haverdes entrado pela estreita porta, tendo recebido o Santo Espírito, o qual leva ao Pai; assim, pressionai avante com firmeza em Cristo, tendo um brilho perfeito de esperança e amor a Deus e a todos os homens.",
          en:"Wherefore, ye must press forward with a steadfastness in Christ, having a perfect brightness of hope, and a love of God and of all men. Wherefore, if ye shall press forward, feasting upon the word of Christ, and endure to the end, behold, thus saith the Father: Ye shall have eternal life."}]},
      { ref:"Enos 1:3–5", topic:"Oração Sincera",
        verses:[{
          pt:"Eis que fui ao caçar animais na floresta; e as palavras que ouvira meu pai falar muitas vezes, concernentes à vida eterna e ao gozo dos santos, mergulharam fundo em meu coração.",
          en:"Behold, I went to hunt beasts in the forests; and the words which I had often heard my father speak concerning eternal life, and the joy of the saints, sunk deep into my heart."},
          {pt:"E minha alma teve fome; e ajoelhei perante o meu Criador e clamei a Ele em oração poderosa e súplica pela minha própria alma; e clamei a Ele durante todo o dia.",
          en:"And my soul hungered; and I kneeled down before my Maker, and I cried unto him in mighty prayer and supplication for mine own soul; and all the day long did I cry unto him; yea, and when the night came I did still raise my voice high that it reached the heavens."},
          {pt:"E veio-me uma voz, dizendo: Enos, os teus pecados são perdoados e serás abençoado.",
          en:"And there came a voice unto me, saying: Enos, thy sins are forgiven thee, and thou shalt be blessed."}]},
      { ref:"Mosias 2:17", topic:"Serviço",
        verses:[{
          pt:"E eis que eu vos digo que estas coisas são sábias e verdadeiras. E o rei Benjamim continuou a falar-lhes, dizendo: Aprendi que quando estais ao serviço dos vossos semelhantes estais apenas ao serviço do vosso Deus.",
          en:"And behold, I tell you these things that ye may learn wisdom; that ye may learn that when ye are in the service of your fellow beings ye are only in the service of your God."}]},
      { ref:"Mosias 3:17", topic:"Salvação por Cristo",
        verses:[{
          pt:"E além disso, o Senhor Todo-Poderoso decretou que a salvação viria para os filhos dos homens somente no e mediante o nome de Cristo, o Senhor Todo-Poderoso.",
          en:"And moreover, I say unto you, that there shall be no other name given nor any other way nor means whereby salvation can come unto the children of men, only in and through the name of Christ, the Lord Omnipotent."}]},
      { ref:"Alma 5:14", topic:"Renascimento Espiritual",
        verses:[{
          pt:"E agora vos pergunto, irmãos meus bem-amados, fostes espiritualmente nascidos de Deus? Recebestes a imagem de Deus gravada nos vossos rostos? Experimentastes esta transformação no vosso coração?",
          en:"And now behold, I ask of you, my brethren of the church, have ye spiritually been born of God? Have ye received his image in your countenances? Have ye experienced this mighty change in your hearts?"}]},
      { ref:"Alma 7:11–12", topic:"A Expiação",
        verses:[{
          pt:"E Ele irá e sofrerá as dores, as doenças e as enfermidades de Seu povo.",
          en:"And he shall go forth, suffering pains and afflictions and temptations of every kind; and this that the word might be fulfilled which saith he will take upon him the pains and the sicknesses of his people."},
          {pt:"E Ele tomará sobre Si a morte, para que possa soltar os laços da morte que prendem o Seu povo; e tomará sobre Si as suas enfermidades, para que o Seu ventre seja cheio de misericórdia.",
          en:"And he will take upon him death, that he may loose the bands of death which bind his people; and he will take upon him their infirmities, that his bowels may be filled with mercy, according to the flesh, that he may know according to the flesh how to succor his people according to their infirmities."}]},
      { ref:"Alma 11:43–44", topic:"A Ressurreição",
        verses:[{
          pt:"O espírito e o corpo serão reunidos em sua forma perfeita; tanto os membros como as juntas serão restaurados ao seu lugar certo — sim, não ficará um só cabelo de suas cabeças a ser perdido.",
          en:"The spirit and the body shall be reunited again in its perfect form; both limb and joint shall be restored to its proper frame, even as we now are at this time; and we shall be brought to stand before God, knowing even as we know now, and have a bright recollection of all our guilt."}]},
      { ref:"Alma 32:27", topic:"Experimentar a Fé",
        verses:[{
          pt:"Mas eis que se não podeis fazer mais que desejar crer, deixai que esse desejo trabalhe em vós, mesmo até acreditardes de maneira que possais dar lugar a uma parte das palavras de Deus.",
          en:"But behold, if ye will awake and arouse your faculties, even to an experiment upon my words, and exercise a particle of faith, yea, even if ye can no more than desire to believe, let this desire work in you, even until ye believe in a manner that ye can give place for a portion of my words."}]},
      { ref:"Alma 34:32–33", topic:"Este Tempo É para o Arrependimento",
        verses:[{
          pt:"Pois eis que esta vida é o tempo para os homens se prepararem para enfrentar a Deus; sim, eis que o dia desta vida é o dia para os homens realizarem as suas obras.",
          en:"For behold, this life is the time for men to prepare to meet God; yea, behold the day of this life is the day for men to perform their labors."},
          {pt:"E agora, como eu disse que vos tenho dito, procurai a Deus enquanto O podes encontrar; porque depois desta vida chegará a noite das trevas em que não pode ser realizado trabalho algum.",
          en:"And now, as I said unto you before, as ye have had so many witnesses, therefore, I beseech of you that ye do not procrastinate the day of your repentance until the end; for after this day of life, which is given us to prepare for eternity, behold, if we do not improve our time while in this life, then cometh the night of darkness wherein there can be no labor performed."}]},
      { ref:"Alma 36:3", topic:"Confiança no Senhor",
        verses:[{
          pt:"Pois quero que saibas que assim como o Senhor viveu, assim vos digo que todo aquele que confiar no Senhor prosperará nesta terra.",
          en:"And now, O my son Helaman, behold, thou art in thy youth, and therefore, I beseech of thee that thou wilt hear my words and learn of me; for I do know that whosoever shall put their trust in God shall be supported in their trials, and their troubles, and their afflictions, and shall be lifted up at the last day."}]},
      { ref:"Alma 37:6–7", topic:"Meios Pequenos e Simples",
        verses:[{
          pt:"Agora, não menosprezeis as pequenas coisas; pois às vezes, por meios pequenos e simples, grandes coisas são levadas a cabo; e pequenos meios confundem o sábio em muitos casos.",
          en:"Now ye may suppose that this is foolishness in me; but behold I say unto you, that by small and simple things are great things brought to pass; and small means in many instances doth confound the wise."},
          {pt:"E o Senhor Deus trabalha por meios de acordo com a Sua sabedoria infinita.",
          en:"And the Lord God doth work by means to bring about his great and eternal purposes; and by very small means the Lord doth confound the wise and bringeth about the salvation of many souls."}]},
      { ref:"3 Néfi 11:10–11", topic:"Jesus Cristo Aparece",
        verses:[{
          pt:"Eis que sou Jesus Cristo, de quem os profetas testemunharam que viria ao mundo.",
          en:"Behold, I am Jesus Christ, whom the prophets testified shall come into the world."},
          {pt:"E eis que sou a luz e a vida do mundo; e bebi, do cálice amargo e derramei o meu sangue pelo mundo, para que todos quantos em mim crerem possam ser salvos.",
          en:"And behold, I am the light and the life of the world; and I have drunk out of that bitter cup which the Father hath given me, and have glorified the Father in taking upon me the sins of the world."}]},
      { ref:"3 Néfi 27:20–21", topic:"O Evangelho de Jesus Cristo",
        verses:[{
          pt:"Ora esta é a palavra, e não há outra palavra dada além desta pela qual o homem possa ser salvo; pois o julgamento do homem justo é isso: que a sua obra é realizada no Meu nome, e que suas obras seguem depois dele.",
          en:"Now this is the commandment: Repent, all ye ends of the earth, and come unto me and be baptized in my name, that ye may be sanctified by the reception of the Holy Ghost, that ye may stand spotless before me at the last day."},
          {pt:"Portanto, Eu vos digo que precisais ser levados até ao Pai.",
          en:"Verily, verily, I say unto you, this is my gospel; and ye know the things that ye must do in my church; for the works which ye have seen me do that shall ye also do; for that which ye have seen me do even that shall ye do."}]},
      { ref:"Moroni 7:33", topic:"Fé para Fazer Milagres",
        verses:[{
          pt:"E Cristo disse: Se tiverdes fé em Mim, tereis poder para fazer todas as coisas que forem convenientes a Mim.",
          en:"And Christ hath said: If ye will have faith in me ye shall have power to do whatsoever thing is expedient in me."}]},
      { ref:"Moroni 7:47–48", topic:"Caridade — O Amor Puro de Cristo",
        verses:[{
          pt:"Mas a caridade é o amor puro de Cristo, e dura para sempre; e quem a possuir no último dia, estará bem com ele.",
          en:"But charity is the pure love of Christ, and it endureth forever; and whoso is found possessed of it at the last day, it shall be well with him."},
          {pt:"Por conseguinte, meus amados irmãos, orai ao Pai com toda a energia do vosso coração, para que possais ser cheios desse amor que Ele concedeu a todos os que são seguidores verdadeiros de Seu Filho Jesus Cristo.",
          en:"Wherefore, my beloved brethren, pray unto the Father with all the energy of heart, that ye may be filled with this love, which he hath bestowed upon all who are true followers of his Son, Jesus Christ."}]},
      { ref:"Moroni 10:3–5", topic:"Promessa de Moroni",
        verses:[{
          pt:"Eis que eu vos exorto a que, quando tiverdes recebido essas coisas, pergunteis a Deus, o Eterno Pai, em nome de Cristo, se estas coisas não são verdadeiras;",
          en:"Behold, I would exhort you that when ye shall read these things, that ye would ask God, the Eternal Father, in the name of Christ, if these things are not true;"},
          {pt:"e se perguntardes com sincero coração, com real intenção, tendo fé em Cristo, Ele vos manifestará a verdade, por meio do poder do Espírito Santo.",
          en:"and if ye shall ask with a sincere heart, with real intent, having faith in Christ, he will manifest the truth of it unto you, by the power of the Holy Ghost."},
          {pt:"E pelo poder do Espírito Santo podeis conhecer a verdade de todas as coisas.",
          en:"And by the power of the Holy Ghost ye may know the truth of all things."}]},
      { ref:"Alma 32:21", topic:"Definição da Fé",
        verses:[{
          pt:"E agora, assim como eu disse que a fé não é ter um conhecimento perfeito das coisas, assim também é com a minha palavra. Não podeis ter conhecimento perfeito agora, pois é por fé que esperais nas coisas que não são vistas, mas que são verdadeiras.",
          en:"And now as I said concerning faith — faith is not to have a perfect knowledge of things; therefore if ye have faith ye hope for things which are not seen, which are true."}]},
    ]
  },

  // ── BÍBLIA SAGRADA — ANTIGO TESTAMENTO ────────────────────────────────────
  { id:"ot", label:"Antigo Testamento", sublabel:"Old Testament", icon:"📜", color:"#5A5450",
    chapters:[
      { ref:"Génesis 1:26–27", topic:"O Homem à Imagem de Deus",
        verses:[{
          pt:"E disse Deus: Façamos o homem à nossa imagem, conforme a nossa semelhança; e domine sobre os peixes do mar, e sobre as aves dos céus, e sobre o gado, e sobre toda a terra.",
          en:"And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth."},
          {pt:"E criou Deus o homem à sua imagem; à imagem de Deus o criou; homem e mulher os criou.",
          en:"So God created man in his own image, in the image of God created he him; male and female created he them."}]},
      { ref:"Josué 24:15", topic:"Escolha a Quem Servirás",
        verses:[{
          pt:"Se, pois, vos parecer mal servir ao Senhor, escolhei hoje a quem servireis. Eu, porém, e a minha casa serviremos ao Senhor.",
          en:"And if it seem evil unto you to serve the Lord, choose you this day whom ye will serve; but as for me and my house, we will serve the Lord."}]},
      { ref:"1 Reis 19:11–12", topic:"A Voz Mansa e Delicada",
        verses:[{
          pt:"E eis que o Senhor passava, e um grande e forte vento fazia rachar os montes e quebrar as penhas diante do Senhor; mas o Senhor não estava no vento. E depois do vento, um tremor de terra; mas o Senhor não estava no tremor de terra.",
          en:"And, behold, the Lord passed by, and a great and strong wind rent the mountains, and brake in pieces the rocks before the Lord; but the Lord was not in the wind: and after the wind an earthquake; but the Lord was not in the earthquake:"},
          {pt:"E depois do tremor de terra, um fogo; mas o Senhor não estava no fogo. E depois do fogo, uma voz mansa e delicada.",
          en:"And after the earthquake a fire; but the Lord was not in the fire: and after the fire a still small voice."}]},
      { ref:"Salmo 46:10", topic:"Sede Quietos",
        verses:[{
          pt:"Sede quietos e sabei que Eu sou Deus; serei exaltado entre as nações, serei exaltado na terra.",
          en:"Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth."}]},
      { ref:"Isaías 1:18", topic:"Os Pecados Como a Escarlate",
        verses:[{
          pt:"Ora, pois, vinde, e arrazoemos juntos, diz o Senhor; se os vossos pecados forem como a escarlate, tornar-se-ão brancos como a neve; se forem vermelhos como o carmesim, ficarão como a lã.",
          en:"Come now, and let us reason together, saith the Lord: though your sins be as scarlet, they shall be as white as snow; though they be red like crimson, they shall be as wool."}]},
      { ref:"Isaías 55:8–9", topic:"Os Pensamentos de Deus São Mais Altos",
        verses:[{
          pt:"Porque os meus pensamentos não são os vossos pensamentos, nem os vossos caminhos, os meus caminhos, diz o Senhor.",
          en:"For my thoughts are not your thoughts, neither are your ways my ways, saith the Lord."},
          {pt:"Porque assim como os céus são mais altos do que a terra, assim são os meus caminhos mais altos do que os vossos caminhos, e os meus pensamentos, mais do que os vossos pensamentos.",
          en:"For as the heavens are higher than the earth, so are my ways higher than your ways, and my thoughts than your thoughts."}]},
      { ref:"Jeremias 1:5", topic:"Conhecido Antes do Nascimento",
        verses:[{
          pt:"Antes que te formasse no ventre, te conheci, e antes que saísses da madre, te santifiquei; às nações te dei por profeta.",
          en:"Before I formed thee in the belly I knew thee; and before thou camest forth out of the womb I sanctified thee, and I ordained thee a prophet unto the nations."}]},
      { ref:"Amós 3:7", topic:"Revelação por Profetas",
        verses:[{
          pt:"Porque o Senhor Deus não fará coisa alguma, sem ter revelado o seu segredo aos seus servos, os profetas.",
          en:"Surely the Lord God will do nothing, but he revealeth his secret unto his servants the prophets."}]},
      { ref:"Malaquias 4:5–6", topic:"O Retorno de Elias",
        verses:[{
          pt:"Eis que eu vos enviarei o profeta Elias, antes que venha o grande e terrível dia do Senhor.",
          en:"Behold, I will send you Elijah the prophet before the coming of the great and dreadful day of the Lord:"},
          {pt:"E ele converterá o coração dos pais a seus filhos, e o coração dos filhos a seus pais.",
          en:"And he shall turn the heart of the fathers to the children, and the heart of the children to their fathers, lest I come and smite the earth with a curse."}]},
    ]
  },

  // ── BÍBLIA SAGRADA — NOVO TESTAMENTO ─────────────────────────────────────
  { id:"bible", label:"Novo Testamento", sublabel:"New Testament", icon:"📘", color:"#1E4D8C",
    chapters:[
      { ref:"Mateus 3:16–17", topic:"O Batismo de Cristo",
        verses:[{
          pt:"E, sendo Jesus batizado, saiu logo da água, e eis que os céus se lhe abriram, e viu o Espírito de Deus descendo como pomba e vindo sobre Ele.",
          en:"And Jesus, when he was baptized, went up straightway out of the water: and, lo, the heavens were opened unto him, and he saw the Spirit of God descending like a dove, and lighting upon him:"},
          {pt:"E eis que uma voz dos céus que dizia: Este é o Meu Filho amado, em quem Me comprazo.",
          en:"And lo a voice from heaven, saying, This is my beloved Son, in whom I am well pleased."}]},
      { ref:"Mateus 5:48", topic:"Sede Perfeitos",
        verses:[{
          pt:"Sede vós, pois, perfeitos, como também o vosso Pai, que está nos céus, é perfeito.",
          en:"Be ye therefore perfect, even as your Father which is in heaven is perfect."}]},
      { ref:"Mateus 7:7–8", topic:"Pedi e Recebereis",
        verses:[{
          pt:"Pedi e dar-se-vos-á; buscai e encontrareis; batei e abrir-se-vos-á.",
          en:"Ask, and it shall be given you; seek, and ye shall find; knock, and it shall be opened unto you:"},
          {pt:"Porque aquele que pede recebe; e o que busca encontra; e ao que bate abrir-se-lhe-á.",
          en:"For every one that asketh receiveth; and he that seeketh findeth; and to him that knocketh it shall be opened."}]},
      { ref:"Mateus 22:36–40", topic:"Os Dois Grandes Mandamentos",
        verses:[{
          pt:"Mestre, qual é o grande mandamento na Lei? Jesus disse-lhe: Amarás o Senhor teu Deus de todo o teu coração, e de toda a tua alma, e de todo o teu entendimento.",
          en:"Master, which is the great commandment in the law? Jesus said unto him, Thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind."},
          {pt:"Este é o primeiro e grande mandamento. E o segundo, semelhante a este, é: Amarás o teu próximo como a ti mesmo.",
          en:"This is the first and great commandment. And the second is like unto it, Thou shalt love thy neighbour as thyself."}]},
      { ref:"Mateus 28:19–20", topic:"A Grande Comissão",
        verses:[{
          pt:"Ide, portanto, e fazei discípulos de todas as nações, batizando-os em nome do Pai, e do Filho, e do Espírito Santo;",
          en:"Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost:"},
          {pt:"ensinando-os a guardar todas as coisas que vos tenho ordenado; e eis que estou convosco todos os dias, até à consumação dos séculos.",
          en:"Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you always, even unto the end of the world."}]},
      { ref:"João 3:5", topic:"Nascer da Água e do Espírito",
        verses:[{
          pt:"Jesus respondeu: Em verdade, em verdade te digo que aquele que não nascer da água e do Espírito, não pode entrar no reino de Deus.",
          en:"Jesus answered, Verily, verily, I say unto thee, Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God."}]},
      { ref:"João 3:16–17", topic:"Amor de Deus",
        verses:[{
          pt:"Porque Deus amou o mundo de tal maneira que deu o Seu Filho Unigénito, para que todo o que nele crê não pereça, mas tenha a vida eterna.",
          en:"For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."},
          {pt:"Porque Deus enviou o Seu Filho ao mundo, não para que condenasse o mundo, mas para que o mundo fosse salvo por Ele.",
          en:"For God sent not his Son into the world to condemn the world; but that the world through him might be saved."}]},
      { ref:"João 7:17", topic:"Conhecer a Doutrina",
        verses:[{
          pt:"Se alguém quiser fazer a vontade do Pai, este saberá quanto à doutrina se ela é de Deus, ou se falo por Mim mesmo.",
          en:"If any man will do his will, he shall know of the doctrine, whether it be of God, or whether I speak of myself."}]},
      { ref:"João 14:6", topic:"O Caminho, a Verdade e a Vida",
        verses:[{
          pt:"Disse-lhe Jesus: Eu sou o caminho, e a verdade, e a vida; ninguém vem ao Pai, senão por Mim.",
          en:"Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me."}]},
      { ref:"João 14:26–27", topic:"O Dom do Espírito Santo",
        verses:[{
          pt:"Mas o Consolador, o Espírito Santo, a quem o Pai enviará em Meu nome, esse vos ensinará todas as coisas e vos recordará tudo quanto vos tenho dito.",
          en:"But the Comforter, which is the Holy Ghost, whom the Father will send in my name, he shall teach you all things, and bring all things to your remembrance, whatsoever I have said unto you."},
          {pt:"Deixo-vos a paz; a Minha paz vos dou; não vo-la dou como o mundo a dá. Não se turbe o vosso coração, nem se atemorize.",
          en:"Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid."}]},
      { ref:"Atos 3:19–21", topic:"A Restauração",
        verses:[{
          pt:"Arrependei-vos e convertei-vos, para que os vossos pecados sejam apagados, e venham os tempos de refrigério da presença do Senhor.",
          en:"Repent ye therefore, and be converted, that your sins may be blotted out, when the times of refreshing shall come from the presence of the Lord;"},
          {pt:"E Ele envie Jesus Cristo, que vos foi antes anunciado; a quem o céu deve receber até aos tempos da restauração de todas as coisas.",
          en:"And he shall send Jesus Christ, which before was preached unto you: Whom the heaven must receive until the times of restitution of all things, which God hath spoken by the mouth of all his holy prophets since the world began."}]},
      { ref:"Atos 8:14–17", topic:"O Dom do Espírito Santo pelas Mãos",
        verses:[{
          pt:"E quando os apóstolos que estavam em Jerusalém ouviram que a Samaria tinha recebido a palavra de Deus, enviaram a eles Pedro e João,",
          en:"Now when the apostles which were at Jerusalem heard that Samaria had received the word of God, they sent unto them Peter and John:"},
          {pt:"os quais, descendo, oraram por eles, para que recebessem o Espírito Santo. Então lhes impuseram as mãos, e eles receberam o Espírito Santo.",
          en:"Who, when they were come down, prayed for them, that they might receive the Holy Ghost: Then laid they their hands on them, and they received the Holy Ghost."}]},
      { ref:"Romanos 8:16–17", topic:"Filhos de Deus",
        verses:[{
          pt:"O próprio Espírito testifica com o nosso espírito que somos filhos de Deus.",
          en:"The Spirit itself beareth witness with our spirit, that we are the children of God:"},
          {pt:"E, se somos filhos, somos também herdeiros; herdeiros de Deus e co-herdeiros de Cristo; se é que com Ele padecemos, para que também com Ele sejamos glorificados.",
          en:"And if children, then heirs; heirs of God, and joint-heirs with Christ; if so be that we suffer with him, that we may be also glorified together."}]},
      { ref:"Efésios 2:19–20", topic:"O Fundamento dos Apóstolos",
        verses:[{
          pt:"Assim, pois, já não sois estranhos e forasteiros, mas concidadãos dos santos e membros da família de Deus,",
          en:"Now therefore ye are no more strangers and foreigners, but fellowcitizens with the saints, and of the household of God;"},
          {pt:"edificados sobre o fundamento dos apóstolos e dos profetas, sendo o próprio Jesus Cristo a pedra angular.",
          en:"And are built upon the foundation of the apostles and prophets, Jesus Christ himself being the chief corner stone."}]},
      { ref:"Efésios 4:11–14", topic:"Apóstolos e Profetas na Igreja",
        verses:[{
          pt:"E Ele mesmo deu uns para apóstolos, e outros para profetas, e outros para evangelistas, e outros para pastores e doutores,",
          en:"And he gave some, apostles; and some, prophets; and some, evangelists; and some, pastors and teachers;"},
          {pt:"para o aperfeiçoamento dos santos, para a obra do ministério, para a edificação do corpo de Cristo,",
          en:"For the perfecting of the saints, for the work of the ministry, for the edifying of the body of Christ:"},
          {pt:"até que todos cheguemos à unidade da fé e do conhecimento do Filho de Deus, a homem perfeito, à medida da estatura da plenitude de Cristo.",
          en:"Till we all come in the unity of the faith, and of the knowledge of the Son of God, unto a perfect man, unto the measure of the stature of the fulness of Christ."}]},
      { ref:"Tiago 1:5", topic:"Se Carecer de Sabedoria",
        verses:[{
          pt:"Se algum de vós tem falta de sabedoria, peça-a a Deus, que a todos dá liberalmente e não censura; e ser-lhe-á dada.",
          en:"If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him."}]},
      { ref:"Tiago 2:17", topic:"Fé e Obras",
        verses:[{
          pt:"Assim também a fé, se não tiver as obras, é morta em si mesma.",
          en:"Even so faith, if it hath not works, is dead, being alone."}]},
      { ref:"Hebreus 5:4", topic:"Chamado por Deus",
        verses:[{
          pt:"Ninguém toma para si esta honra, senão aquele que é chamado por Deus, como também o foi Aarão.",
          en:"And no man taketh this honour unto himself, but he that is called of God, as was Aaron."}]},
    ]
  },

  // ── DOUTRINA E CONVÉNIOS ──────────────────────────────────────────────────
  { id:"dc", label:"Doutrina e Convénios", sublabel:"Doctrine & Covenants", icon:"📙", color:"#B8511A",
    chapters:[
      { ref:"D&C 1:30", topic:"A Igreja Verdadeira e Viva",
        verses:[{
          pt:"E também a única Igreja verdadeira e viva sobre toda a face da terra, com a qual Eu, o Senhor, estou bem satisfeito.",
          en:"And also the only true and living church upon the face of the whole earth, with which I, the Lord, am well pleased, speaking unto the church collectively and not individually."}]},
      { ref:"D&C 4:2–4", topic:"O Chamado Missionário",
        verses:[{
          pt:"Portanto, ó vós que embarcais no serviço de Deus, vede que o servis com todo o vosso coração, poder, mente e força, a fim de que possais ser encontrados imaculados perante Deus no último dia.",
          en:"Therefore, O ye that embark in the service of God, see that ye serve him with all your heart, might, mind and strength, that ye may stand blameless before God at the last day."},
          {pt:"Por isso, se tiverdes o desejo de servir a Deus, sois chamados à obra;",
          en:"Therefore, if ye have desires to serve God ye are called to the work;"},
          {pt:"pois eis que o campo já está branco para a ceifa; portanto, todo aquele que deseje colher, colha com a sua foice enquanto é dia, para que armazene os seus frutos para a vida eterna.",
          en:"For behold the field is white already to harvest; and lo, he that thrusteth in his sickle with his might, the same layeth up in store that he perisheth not, but bringeth salvation to his soul."}]},
      { ref:"D&C 6:36", topic:"Olha para Mim",
        verses:[{
          pt:"Olha para Mim em todos os pensamentos; não duvides, não temas.",
          en:"Look unto me in every thought; doubt not, fear not."}]},
      { ref:"D&C 8:2–3", topic:"Revelação pela Mente e Coração",
        verses:[{
          pt:"Sim, eis que vou dizer-te na tua mente e no teu coração pelo Espírito Santo, que virá sobre ti e habitará no teu coração.",
          en:"Yea, behold, I will tell you in your mind and in your heart, by the Holy Ghost, which shall come upon you and which shall dwell in your heart."},
          {pt:"Agora, eis que isso é o espírito de revelação; eis que tua é a missão de Elias que deves realizar para preparar o caminho para os grandes trabalhos que virão a seguir.",
          en:"Now, behold, this is the spirit of revelation; behold, this is the spirit by which Moses brought the children of Israel through the Red Sea on dry ground."}]},
      { ref:"D&C 9:7–9", topic:"Estudo no Teu Espírito",
        verses:[{
          pt:"Eis que não te ensinei que deves estudar isso em tua mente? Então, não dizei que me confiastes que vos instruísse antes do tempo; agora eis que digo-te que deves confiar em Mim nessas coisas.",
          en:"Behold, you have not understood; you have supposed that I would give it unto you, when you took no thought save it was to ask me."},
          {pt:"Mas eis que digo-te que deves estudar nas tuas mentes; então me perguntar se está correto e se for correto, farei que o teu seio queime dentro de ti.",
          en:"But, behold, I say unto you, that you must study it out in your mind; then you must ask me if it be right, and if it is right I will cause that your bosom shall burn within you; therefore, you shall feel that it is right."},
          {pt:"Mas se não for correto, não terás tais sentimentos, mas terás um estupor de pensamento.",
          en:"But if it be not right you shall have no such feelings, but you shall have a stupor of thought that shall cause you to forget the thing which is wrong."}]},
      { ref:"D&C 11:21", topic:"Obtém a Minha Palavra",
        verses:[{
          pt:"Não procures declarar a Minha palavra, mas primeiramente busca obter a Minha palavra, e então terás a tua língua desatada; e então, se quiseres, terás o Meu Espírito e a Minha palavra.",
          en:"Seek not to declare my word, but first seek to obtain my word, and then shall your tongue be loosed; then, if you desire, you shall have my Spirit and my word, yea, the power of God unto the convincing of men."}]},
      { ref:"D&C 14:7", topic:"Vida Eterna — O Dom Mais Excelente",
        verses:[{
          pt:"E se guardares os Meus mandamentos e perseverares até ao fim, terás a vida eterna, que é o dom mais excelente de Deus.",
          en:"And, if you keep my commandments and endure to the end you shall have eternal life, which gift is the greatest of all the gifts of God."}]},
      { ref:"D&C 18:10–11", topic:"O Valor das Almas",
        verses:[{
          pt:"Lembrai-vos de que o valor das almas é grande aos olhos de Deus;",
          en:"Remember the worth of souls is great in the sight of God;"},
          {pt:"Pois eis que o Senhor vosso Redentor sofreu a morte na carne; portanto Ele sofreu as dores de todos os homens, para que todos os homens pudessem arrepender-se e virem a Ele.",
          en:"For, behold, the Lord your Redeemer suffered death in the flesh; wherefore he suffered the pain of all men, that all men might repent and come unto him."}]},
      { ref:"D&C 20:37", topic:"Condições para o Batismo",
        verses:[{
          pt:"E novamente, por via de mandamento à Igreja, concernente ao modo de batismo — todos aqueles que se humilharem verdadeiramente perante Deus e desejarem ser batizados, e vierem com corações quebrantados e espíritos contristados, e testemunharem perante a Igreja que verdadeiramente se arrependeram de todos os seus pecados.",
          en:"And again, by way of commandment to the church concerning the manner of baptism — All those who humble themselves before God, and desire to be baptized, and come forth with broken hearts and contrite spirits, and witness before the church that they have truly repented of all their sins."}]},
      { ref:"D&C 50:13–14", topic:"Por que Fui Enviado",
        verses:[{
          pt:"Por isso, Eu, o Senhor, vos pergunto: Que pregam aqueles que foram enviados em Meu nome? Certamente, verdadeiramente, essa é a minha doutrina: aquele que é ordenado por Mim e enviado em Meu nome para pregar o evangelho da forma humilde.",
          en:"Wherefore, I the Lord ask you this question — unto what were ye ordained? To preach my gospel by the Spirit, even the Comforter which was sent forth to teach the truth."}]},
      { ref:"D&C 58:26–27", topic:"Ação e Iniciativa",
        verses:[{
          pt:"Pois eis que não é conveniente que Eu ordene em tudo, pois aquele que é compelido em tudo é um servo preguiçoso e não sábio.",
          en:"For behold, it is not meet that I should command in all things; for he that is compelled in all things, the same is a slothful and not a wise servant."},
          {pt:"Por isso, os homens devem empenhar-se ativamente numa boa causa e fazer muitas coisas de sua própria livre vontade e levar a cabo muita justiça.",
          en:"Verily I say, men should be anxiously engaged in a good cause, and do many things of their own free will, and bring to pass much righteousness."}]},
      { ref:"D&C 76:22–24", topic:"Testemunho de Jesus Cristo",
        verses:[{
          pt:"E agora, depois de muitas testemunhas que foram dadas acerca Dele, eis que esta é a testemunha, a última de todas, que damos d'Ele: Que Ele vive!",
          en:"And now, after the many testimonies which have been given of him, this is the testimony, last of all, which we give of him: That he lives!"},
          {pt:"Pois nós O vimos, até mesmo à direita de Deus; e ouvimos a voz testemunhando que Ele é o Unigénito do Pai.",
          en:"For we saw him, even on the right hand of God; and we heard the voice bearing record that he is the Only Begotten of the Father."},
          {pt:"Que por Ele, e por meio d'Ele, e D'Ele, os mundos foram criados e os seus habitantes são filhos nascidos de Deus.",
          en:"That by him, and through him, and of him, the worlds are and were created, and the inhabitants thereof are begotten sons and daughters unto God."}]},
      { ref:"D&C 84:33–35", topic:"Juramentos e Convénios do Sacerdócio",
        verses:[{
          pt:"Porque aquele que recebe as minhas ordenanças, afirma que pertence ao Meu sacerdócio, e recebe o sacerdócio de acordo com esse juramento e convénio de Meu Pai.",
          en:"For whoso is faithful unto the obtaining these two priesthoods of which I have spoken, and the magnifying their calling, are sanctified by the Spirit unto the renewing of their bodies."},
          {pt:"Todos os que recebem esse sacerdócio recebem-Me, diz o Senhor.",
          en:"They become the sons of Moses and of Aaron and the seed of Abraham, and the church and kingdom, and the elect of God. And also all they who receive this priesthood receive me, saith the Lord."}]},
      { ref:"D&C 88:63", topic:"Aproxima-te de Deus",
        verses:[{
          pt:"Aproxima-te de Mim e Eu me aproximarei de ti; buscai-Me diligentemente e haveis de encontrar-Me; pedi e recebereis; batei e abrir-se-vos-á.",
          en:"Draw near unto me and I will draw near unto you; seek me diligently and ye shall find me; ask, and ye shall receive; knock, and it shall be opened unto you."}]},
      { ref:"D&C 121:7–8", topic:"Paz na Adversidade",
        verses:[{
          pt:"Meu filho, paz seja para a tua alma; a tua adversidade e as tuas aflições não durarão mais que um pequeno momento;",
          en:"My son, peace be unto thy soul; thine adversity and thine afflictions shall be but a small moment;"},
          {pt:"E então, se suportares isso bem, Deus te exaltará nas alturas; triunfarás sobre todos os teus inimigos.",
          en:"And then, if thou endure it well, God shall exalt thee on high; thou shalt triumph over all thy foes."}]},
      { ref:"D&C 130:22–23", topic:"A Natureza de Deus",
        verses:[{
          pt:"O Pai tem um corpo de partes e paixões tão tangível quanto o do homem; o Filho também; mas o Espírito Santo não tem um corpo de carne e ossos, mas é um personagem de Espírito.",
          en:"The Father has a body of flesh and bones as tangible as man's; the Son also; but the Holy Ghost has not a body of flesh and bones, but is a personage of Spirit. Were it not so, the Holy Ghost could not dwell in us."},
          {pt:"Um homem pode receber o Espírito Santo e pode recebê-lo apenas temporariamente e o dom do Espírito Santo pode ser conferido.",
          en:"A man may receive the Holy Ghost, and it may descend upon him and not tarry with him."}]},
      { ref:"D&C 131:1–4", topic:"O Casamento Eterno",
        verses:[{
          pt:"No grau celestial há três céus ou graus; e para obter o mais elevado, um homem deve entrar nesta ordem do sacerdócio, o que significa o novo e eterno convénio do casamento;",
          en:"In the celestial glory there are three heavens or degrees; And in order to obtain the highest, a man must enter into this order of the priesthood meaning the new and everlasting covenant of marriage;"},
          {pt:"E se não fizer isso, não pode obtê-lo.",
          en:"And if he does not, he cannot obtain it. He may enter into the other, but that is the end of his kingdom; he cannot have an increase."}]},
    ]
  },

  // ── PÉROLA DE GRANDE VALOR ────────────────────────────────────────────────
  { id:"pgp", label:"Pérola de Grande Valor", sublabel:"Pearl of Great Price", icon:"✨", color:"#A87820",
    chapters:[
      { ref:"Moisés 1:39", topic:"A Obra e a Glória de Deus",
        verses:[{
          pt:"Pois eis que esta é a Minha obra e a Minha glória — levar a cabo a imortalidade e a vida eterna do homem.",
          en:"For behold, this is my work and my glory — to bring to pass the immortality and eternal life of man."}]},
      { ref:"Moisés 7:18", topic:"Sião — Unidade de Coração",
        verses:[{
          pt:"E o Senhor chamou o Seu povo SIÃO, porque eram de um só coração e de um só pensamento e viviam em justiça; e não havia pobres entre eles.",
          en:"And the Lord called his people Zion, because they were of one heart and one mind, and dwelt in righteousness; and there was no poor among them."}]},
      { ref:"Abraão 3:22–23", topic:"Almas Nobres e Grandes",
        verses:[{
          pt:"E o Senhor deu-me a ver inteligências que foram organizadas antes de o mundo ser; e entre todas essas havia muitas das nobres e grandes.",
          en:"Now the Lord had shown unto me, Abraham, the intelligences that were organized before the world was; and among all these there were many of the noble and great ones;"},
          {pt:"E Deus viu essas almas que eram boas e disse: Farei destes os Meus governantes; pois Ele estava entre eles e disse: Eu sou o Senhor teu Deus; escolhi-te antes de tu nasceres.",
          en:"And God saw these souls that they were good, and he stood in the midst of them, and he said: These I will make my rulers; for he stood among those that were spirits, and he saw that they were good; and he said unto me: Abraham, thou art one of them; thou wast chosen before thou wast born."}]},
      { ref:"José Smith — História 1:15–17", topic:"A Primeira Visão",
        verses:[{
          pt:"Encontrava-me num belo dia sereno, no início da primavera de mil oitocentos e vinte. Era um dia belo e sereno. Assim que Vi as personagens, o espírito que havia possuído uma estranha influência sobre minha mente desapareceu.",
          en:"It was on the morning of a beautiful, clear day, early in the spring of eighteen hundred and twenty. I saw a pillar of light exactly over my head, above the brightness of the sun, which descended gradually until it fell upon me."},
          {pt:"Quando a luz pousou sobre mim, eu vi dois Personagens cuja claridade e glória desafiam toda a descrição, de pé acima de mim no ar. Um deles falou comigo, chamando-me pelo nome, e disse, apontando para o outro: Este é o Meu Filho Amado. Escuta-O!",
          en:"When the light rested upon me I saw two Personages, whose brightness and glory defy all description, standing above me in the air. One of them spake unto me, calling me by name and said, pointing to the other — This is My Beloved Son. Hear Him!"}]},
      { ref:"José Smith — História 1:19", topic:"Apostasia e Restauração",
        verses:[{
          pt:"Respondeu-me que eu não devia unir-me a nenhuma delas, porque todas estavam erradas; e o Personagem que me falou disse que todas as suas credos eram uma abominação aos Seus olhos.",
          en:"I was answered that I must join none of them, for they were all wrong; and the Personage who addressed me said that all their creeds were an abomination in his sight; that those professors were all corrupt."}]},
      { ref:"Artigos de Fé 1:1–4", topic:"Os Artigos de Fé — Princípios Fundamentais",
        verses:[{
          pt:"Cremos em Deus, o Eterno Pai, e em Seu Filho, Jesus Cristo, e no Espírito Santo.",
          en:"We believe in God, the Eternal Father, and in His Son, Jesus Christ, and in the Holy Ghost."},
          {pt:"Cremos que os homens serão punidos pelos seus próprios pecados, e não pela transgressão de Adão.",
          en:"We believe that men will be punished for their own sins, and not for Adam's transgression."},
          {pt:"Cremos que, por meio da Expiação de Cristo, toda a humanidade pode ser salva, mediante a obediência às leis e às ordenanças do Evangelho.",
          en:"We believe that through the Atonement of Christ, all mankind may be saved, by obedience to the laws and ordinances of the Gospel."},
          {pt:"Cremos que os primeiros princípios e ordenanças do Evangelho são: primeiro, Fé no Senhor Jesus Cristo; segundo, Arrependimento; terceiro, Batismo por imersão para a remissão dos pecados; quarto, Imposição de mãos para o dom do Espírito Santo.",
          en:"We believe that the first principles and ordinances of the Gospel are: first, Faith in the Lord Jesus Christ; second, Repentance; third, Baptism by immersion for the remission of sins; fourth, Laying on of hands for the gift of the Holy Ghost."}]},
      { ref:"Artigos de Fé 1:6–7", topic:"Os Artigos de Fé — Organização da Igreja",
        verses:[{
          pt:"Cremos na mesma organização que existiu na Igreja Primitiva, ou seja: apóstolos, profetas, pastores, mestres, evangelistas e assim por diante.",
          en:"We believe in the same organization that existed in the Primitive Church, namely, apostles, prophets, pastors, teachers, evangelists, and so forth."},
          {pt:"Cremos no dom das línguas, da profecia, da revelação, das visões, da cura, da interpretação de línguas e assim por diante.",
          en:"We believe in the gift of tongues, prophecy, revelation, visions, healing, interpretation of tongues, and so forth."}]},
      { ref:"Artigos de Fé 1:13", topic:"Os Artigos de Fé — Virtude e Esperança",
        verses:[{
          pt:"Cremos em ser honestos, verdadeiros, castos, benevolentes, virtuosos e em fazer o bem a todos os homens. De fato, podemos dizer que seguimos a admoestação de Paulo: Cremos todas as coisas, esperamos todas as coisas, suportamos muitas coisas e esperamos poder suportar todas as coisas. Se existe qualquer coisa virtuosa, bela, amável ou de boa reputação, buscamos essas coisas.",
          en:"We believe in being honest, true, chaste, benevolent, virtuous, and in doing good to all men; indeed, we may say that we follow the admonition of Paul — We believe all things, we hope all things, we have endured many things, and hope to be able to endure all things. If there is anything virtuous, lovely, or of good report or praiseworthy, we seek after these things."}]},
    ]
  },
];

// ══════════════════════════════════════════════════════════════════════════════
//  PHASE 4 — AI CONVERSATION PERSONAS
// ══════════════════════════════════════════════════════════════════════════════
const AI_PERSONAS = [
  { id:"maria",   name:"Maria Ferreira",   age:45,
    icon:"👩", color:"#1E4D8C", bgColor:"#EEF2FA",
    description:"Dona de casa curiosa, Porto",
    personality:"Warm and curious but protective of her Catholic faith. She asks sincere questions. She worries about what her neighbours will think.",
    opening:"Bom dia! Estavam à minha porta? Estou um pouco ocupada, mas pode dizer o que pretende.",
    scenarioLabel:"First visit — curious housewife"
  },
  { id:"antonio", name:"António Costa",    age:28,
    icon:"👨", color:"#B8511A", bgColor:"#FAF0EA",
    description:"Profissional jovem, cético",
    personality:"Busy, skeptical but polite. He thinks religion is for the elderly. He is genuinely interested in family values and happiness.",
    opening:"Olá. Tenho poucos minutos — trabalho de casa hoje. O que querem?",
    scenarioLabel:"Door contact — skeptical young professional"
  },
  { id:"rosa",    name:"Avó Rosa Santos",  age:70,
    icon:"👵", color:"#6E1A34", bgColor:"#F0E4EA",
    description:"Avó católica devota, tradicional",
    personality:"Deeply Catholic, loves to talk about God and Jesus, but cannot understand why there would be a new church. She is warm and generous — offer her the scripture in James 1:5.",
    opening:"Ai, que surpresa! Entrem, entrem! Quero um chazinho? Eu já conheço Jesus há muito tempo, sabia?",
    scenarioLabel:"Return visit — devout Catholic grandmother"
  },
  { id:"carlos",  name:"Carlos Oliveira",  age:40,
    icon:"👨‍👧", color:"#046A38", bgColor:"#E8F4EC",
    description:"Pai de família, prático",
    personality:"Practical, values family deeply. Not religious but respects faith. He recently had a difficult year and is quietly searching for something.",
    opening:"Boa tarde. São da Igreja de Jesus Cristo? Já vi os vossos chapéus pela cidade. O que é que ensinam, concretamente?",
    scenarioLabel:"Prepared investigator — family man"
  },
  { id:"sofia",   name:"Sofia Pinto",      age:22,
    icon:"👩‍🎓", color:"#A87820", bgColor:"#FAF4E8",
    description:"Estudante universitária, curiosa",
    personality:"Curious, open-minded university student studying history. She has many questions about the Book of Mormon and about Joseph Smith. She is friendly and direct.",
    opening:"Olá! Sou estudante — adoro aprender sobre religiões diferentes. O Livro de Mórmon é um texto histórico ou uma escritura?",
    scenarioLabel:"Curious investigator — student with questions"
  },
];


// ══════════════════════════════════════════════════════════════════════════════
//  SCRIPTURE STUDY VIEW
// ══════════════════════════════════════════════════════════════════════════════
function ScriptureView({scriptureData,saveScriptureData}){
  const [book,setBook]       = useState("bom");
  const [activeRef,setActiveRef]= useState(null);
  const [filterBkmk,setFilterBkmk]= useState(false);
  const [noteVal,setNoteVal]  = useState("");
  const [playing,setPlaying]  = useState(null);

  const activeBook = SCRIPTURE_BOOKS.find(b=>b.id===book);
  const bookmarks  = scriptureData.bookmarks||{};
  const notes      = scriptureData.notes||{};
  const heard      = scriptureData.heard||{};

  const toggleBookmark=(ref)=>{
    const b={...bookmarks}; b[ref]=!b[ref];
    saveScriptureData({...scriptureData,bookmarks:b});
  };
  const saveNote=(ref,val)=>{
    const n={...notes}; n[ref]=val;
    saveScriptureData({...scriptureData,notes:n});
  };
  const logHeard=(ref)=>{
    const h={...heard}; h[ref]=(h[ref]||0)+1;
    saveScriptureData({...scriptureData,heard:h});
  };
  const playVerses=(chap)=>{
    const txt=chap.verses.map(v=>v.pt).join(" ");
    setPlaying(chap.ref);
    speakPT(txt,0.76);
    logHeard(chap.ref);
    setTimeout(()=>setPlaying(null), Math.max(3000,txt.length*90));
  };

  const totalChapters = SCRIPTURE_BOOKS.reduce((a,b)=>a+b.chapters.length,0);
  const heardCount    = Object.keys(heard).length;
  const bookmarkCount = Object.values(bookmarks).filter(Boolean).length;

  const chapters = filterBkmk
    ? activeBook.chapters.filter(c=>bookmarks[c.ref])
    : activeBook.chapters;

  return(
    <div style={{padding:"1.5rem 0"}}>
      {/* Stats */}
      <div style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:"12px",
                   padding:"12px 16px",marginBottom:"14px",display:"flex",gap:"20px",alignItems:"center"}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}>
            <span style={{fontSize:"12px",color:C.muted}}>Passages studied</span>
            <span style={{fontSize:"12px",fontWeight:"500",color:C.green}}>{heardCount}/{totalChapters}</span>
          </div>
          <div style={{height:"6px",background:C.border,borderRadius:"3px",overflow:"hidden"}}>
            <div style={{width:`${(heardCount/totalChapters)*100}%`,height:"100%",background:C.green,borderRadius:"3px"}}/>
          </div>
        </div>
        <button onClick={()=>setFilterBkmk(!filterBkmk)}
          style={{padding:"6px 12px",borderRadius:"9px",fontSize:"12px",cursor:"pointer",
                  border:`0.5px solid ${filterBkmk?C.gold:C.border}`,
                  background:filterBkmk?C.softGold:"transparent",
                  color:filterBkmk?C.ochre:C.muted}}>
          🔖 Bookmarks ({bookmarkCount})
        </button>
      </div>

      {/* Book selector */}
      <div style={{display:"flex",gap:"5px",flexWrap:"wrap",marginBottom:"16px"}}>
        {SCRIPTURE_BOOKS.map(b=>(
          <button key={b.id} onClick={()=>{setBook(b.id);setActiveRef(null);}}
            style={{flex:"1 1 auto",minWidth:"80px",padding:"9px 7px",borderRadius:"11px",fontSize:"11px",cursor:"pointer",
                    border:book===b.id?"none":`0.5px solid ${C.border}`,
                    background:book===b.id?b.color:"transparent",
                    color:book===b.id?C.onDark:C.muted,fontWeight:book===b.id?"500":"400",
                    textAlign:"center"}}>
            <div style={{fontSize:"18px",marginBottom:"2px"}}>{b.icon}</div>
            <div style={{fontSize:"11px",lineHeight:1.3}}>{b.label}</div>
          </button>
        ))}
      </div>

      {/* Info banner */}
      <div style={{background:C.softBlue,borderLeft:`3px solid ${C.azulejo}`,borderRadius:"10px",
                   padding:"9px 13px",marginBottom:"14px",fontSize:"12px",color:C.azulejo}}>
        <strong>How to use:</strong> 🔊 plays each passage aloud in European Portuguese · 🔖 bookmarks key scriptures · 📝 add personal study notes · All saved automatically.
      </div>

      {/* Scripture cards */}
      {chapters.length===0&&(
        <div style={{textAlign:"center",padding:"30px",color:C.faint,fontSize:"13px"}}>
          No bookmarked scriptures in this book yet. Bookmark a passage to see it here.
        </div>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
        {chapters.map(chap=>{
          const isOpen   = activeRef===chap.ref;
          const isBkmk   = !!bookmarks[chap.ref];
          const isPlaying= playing===chap.ref;
          const wasHeard = (heard[chap.ref]||0)>0;
          const hasNote  = !!(notes[chap.ref]);
          return(
            <div key={chap.ref} style={{background:isOpen?C.surface:isBkmk?C.softGold:C.surface,
                                         border:`0.5px solid ${isOpen?activeBook.color:isBkmk?C.gold:C.border}`,
                                         borderRadius:"14px",overflow:"hidden",
                                         borderLeft:`4px solid ${isBkmk?C.gold:wasHeard?activeBook.color:C.border}`}}>
              {/* Header row */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                           padding:"14px 16px",cursor:"pointer"}}
                   onClick={()=>{setActiveRef(isOpen?null:chap.ref);setNoteVal(notes[chap.ref]||"");}}>
                <div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:"16px",color:activeBook.color,marginBottom:"2px"}}>
                    {chap.ref}
                  </div>
                  <div style={{fontSize:"12px",color:C.faint,display:"flex",gap:"8px",alignItems:"center"}}>
                    <span>{chap.topic}</span>
                    {wasHeard&&<span style={{color:activeBook.color}}>· heard ×{heard[chap.ref]}</span>}
                    {hasNote&&<span style={{color:C.gold}}>· 📝</span>}
                  </div>
                </div>
                <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
                  {isBkmk&&<span style={{fontSize:"14px"}}>🔖</span>}
                  <span style={{fontSize:"12px",color:C.faint}}>{isOpen?"▲":"▼"}</span>
                </div>
              </div>

              {/* Expanded content */}
              {isOpen&&(
                <div style={{padding:"0 16px 16px"}}>
                  {/* Side-by-side verses */}
                  {chap.verses.map((v,i)=>(
                    <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",
                                         marginBottom:i<chap.verses.length-1?"12px":"0",
                                         padding:"12px",background:C.bg,borderRadius:"10px",
                                         border:`0.5px solid ${C.border}`,
                                         ...(chap.verses.length>1?{borderLeft:`3px solid ${activeBook.color}`}:{})}}>
                      <div>
                        <div style={{fontSize:"10px",letterSpacing:"0.1em",textTransform:"uppercase",
                                     color:activeBook.color,marginBottom:"5px",fontWeight:"500"}}>
                          🇵🇹 Português
                        </div>
                        <div style={{fontFamily:"Georgia,serif",fontSize:"14px",color:C.ink,lineHeight:1.7}}>
                          {v.pt}
                        </div>
                      </div>
                      <div style={{borderLeft:`1px solid ${C.border}`,paddingLeft:"12px"}}>
                        <div style={{fontSize:"10px",letterSpacing:"0.1em",textTransform:"uppercase",
                                     color:C.muted,marginBottom:"5px",fontWeight:"500"}}>
                          🇬🇧 English
                        </div>
                        <div style={{fontFamily:"Georgia,serif",fontSize:"13px",color:C.muted,
                                     lineHeight:1.7,fontStyle:"italic"}}>
                          {v.en}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Action buttons */}
                  <div style={{display:"flex",gap:"7px",marginTop:"12px",flexWrap:"wrap"}}>
                    <button onClick={()=>playVerses(chap)}
                      style={{background:isPlaying?activeBook.color:C.surface,
                              border:`0.5px solid ${isPlaying?activeBook.color:C.border}`,
                              borderRadius:"9px",padding:"8px 14px",
                              color:isPlaying?C.onDark:C.muted,fontSize:"12px",cursor:"pointer",
                              transition:"all 0.2s"}}>
                      🔊 {isPlaying?"Playing…":"Hear in European Portuguese"}
                    </button>
                    <button onClick={()=>toggleBookmark(chap.ref)}
                      style={{background:isBkmk?C.softGold:"transparent",
                              border:`0.5px solid ${isBkmk?C.gold:C.border}`,
                              borderRadius:"9px",padding:"8px 14px",
                              color:isBkmk?C.ochre:C.muted,fontSize:"12px",cursor:"pointer"}}>
                      {isBkmk?"🔖 Bookmarked":"🔖 Bookmark"}
                    </button>
                    <button onClick={()=>speakPT(chap.ref+" — "+chap.topic,0.8)}
                      style={{background:"transparent",border:`0.5px solid ${C.border}`,
                              borderRadius:"9px",padding:"8px 14px",
                              color:C.faint,fontSize:"12px",cursor:"pointer"}}>
                      🎯 Hear reference
                    </button>
                  </div>

                  {/* Study note */}
                  <div style={{marginTop:"12px"}}>
                    <div style={{fontSize:"11px",color:C.faint,marginBottom:"5px",
                                 letterSpacing:"0.08em",textTransform:"uppercase"}}>📝 Personal study note</div>
                    <textarea value={noteVal} onChange={e=>setNoteVal(e.target.value)}
                      onBlur={()=>saveNote(chap.ref,noteVal)}
                      placeholder="Write your thoughts, impressions, or how you'll use this scripture in a lesson..."
                      style={{width:"100%",minHeight:"72px",padding:"10px 12px",
                              background:C.bg,border:`0.5px solid ${C.border}`,
                              borderRadius:"9px",fontSize:"13px",color:C.ink,
                              fontFamily:"inherit",resize:"vertical",boxSizing:"border-box"}}/>
                    <div style={{fontSize:"11px",color:C.faint,textAlign:"right",marginTop:"3px"}}>
                      Auto-saved on blur
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
//  AI CONVERSATION VIEW — Claude-powered investigator roleplay
// ══════════════════════════════════════════════════════════════════════════════
function AIConversationView({convData,saveConvData,apiKey,onClearKey}){
  const [persona,setPersona]     = useState(null);
  const [messages,setMessages]   = useState([]);  // [{role,pt,feedback,ts}]
  const [apiHistory,setApiHistory]= useState([]); // for Claude API
  const [input,setInput]          = useState("");
  const [loading,setLoading]      = useState(false);
  const [sessionDone,setSessionDone]= useState(false);
  const [showFeedback,setShowFeedback]= useState(true);
  const endRef = useRef(null);
  const inputRef= useRef(null);

  const totalSessions = convData.sessions||0;
  const totalMessages = convData.totalMessages||0;

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  const startConversation=(p)=>{
    setPersona(p);
    setSessionDone(false);
    setInput("");
    const opening = {role:"assistant",pt:p.opening,feedback:"",ts:Date.now()};
    setMessages([opening]);
    setApiHistory([{role:"assistant",content:p.opening}]);
    speakPT(p.opening,0.78);
  };

  const sendMessage=async()=>{
    if(!input.trim()||loading) return;
    const userMsg={role:"user",pt:input.trim(),feedback:"",ts:Date.now()};
    const newMessages=[...messages,userMsg];
    const newHistory=[...apiHistory,{role:"user",content:input.trim()}];
    setMessages(newMessages); setApiHistory(newHistory);
    setInput(""); setLoading(true);

    const systemPrompt=`You are ${persona.name}, ${persona.description}, living in Porto, Portugal. Sister Bennett is an LDS missionary from Canada visiting you.

Your personality: ${persona.personality}

STRICT RULES:
1. Your response MUST be in European Portuguese (pt-PT) only — this is a language training tool
2. Keep your response to 2–4 natural sentences as a real person would speak
3. Stay authentically in character — have real reactions, questions, doubts or interest
4. Do NOT be instantly converted — make this realistic practice
5. After your Portuguese response, write exactly "---FEEDBACK---" on its own line, then give 1–2 sentences of English feedback for the student: praise something specific she said well, and gently note one grammar point or vocabulary improvement she could make

Remember: You are in Porto. You speak European Portuguese. Be warm but real.`;

    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:systemPrompt,
          messages:newHistory
        })
      });
      const data=await res.json();
      const fullText=data.content?.[0]?.text||"Desculpe, não percebi.";
      const parts=fullText.split("---FEEDBACK---");
      const ptResponse=(parts[0]||"").trim();
      const fbResponse=(parts[1]||"").trim();

      const aiMsg={role:"assistant",pt:ptResponse,feedback:fbResponse,ts:Date.now()};
      setMessages(prev=>[...prev,aiMsg]);
      setApiHistory(prev=>[...prev,{role:"assistant",content:ptResponse}]);
      speakPT(ptResponse,0.78);
      saveConvData({...convData,
        sessions:totalSessions+(messages.length===1?1:0),
        totalMessages:totalMessages+1
      });
    }catch(e){
      setMessages(prev=>[...prev,{role:"assistant",
        pt:"Desculpe, houve um problema técnico. Tente novamente.",
        feedback:"There was a connection error — please try again.",ts:Date.now()}]);
    }
    setLoading(false);
  };

  const endSession=()=>{
    setSessionDone(true);
    saveConvData({...convData,
      sessions:(convData.sessions||0)+1,
      totalMessages:(convData.totalMessages||0)+messages.filter(m=>m.role==="user").length
    });
  };

  const reset=()=>{setPersona(null);setMessages([]);setApiHistory([]);setSessionDone(false);setInput("");};

  // ── Persona selection screen ──
  if(!persona){
    return(
      <div style={{padding:"1.5rem 0"}}>
        <div style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:"12px",
                     padding:"12px 16px",marginBottom:"16px",display:"flex",gap:"20px",alignItems:"center"}}>
          <div>
            <div style={{fontSize:"12px",color:C.muted}}>Total conversations</div>
            <div style={{fontFamily:"Georgia,serif",fontSize:"22px",color:C.douro}}>{totalSessions}</div>
          </div>
          <div>
            <div style={{fontSize:"12px",color:C.muted}}>Messages exchanged</div>
            <div style={{fontFamily:"Georgia,serif",fontSize:"22px",color:C.green}}>{totalMessages}</div>
          </div>
        </div>

        <p style={{fontSize:"13px",color:C.muted,lineHeight:1.7,marginBottom:"18px"}}>
          Choose an investigator to practice with. Claude will play the role of a real Portuguese person, responding in European Portuguese. You reply as Sister Bennett — in Portuguese. After each exchange, you'll receive grammar feedback in English.
        </p>

        <div style={{background:C.softBlue,borderLeft:`3px solid ${C.azulejo}`,borderRadius:"10px",
                     padding:"9px 13px",marginBottom:"16px",fontSize:"12px",color:C.azulejo}}>
          <strong>Tips:</strong> Use full sentences · Use formal "você" or "o senhor/a senhora" with strangers · End with a prayer or a return appointment · Aim for 6–10 exchanges per session.
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:"9px"}}>
          {AI_PERSONAS.map(p=>(
            <button key={p.id} onClick={()=>startConversation(p)}
              style={{background:C.surface,border:`0.5px solid ${C.border}`,
                      borderLeft:`4px solid ${p.color}`,borderRadius:"14px",
                      padding:"16px",cursor:"pointer",textAlign:"left",
                      display:"flex",gap:"14px",alignItems:"center",position:"relative",overflow:"hidden"}}>
              <AzPat size={60} opacity={0.05}/>
              <div style={{width:"48px",height:"48px",borderRadius:"50%",background:p.color,
                           color:C.onDark,display:"flex",alignItems:"center",justifyContent:"center",
                           fontSize:"22px",flexShrink:0}}>{p.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"Georgia,serif",fontSize:"16px",color:C.ink,marginBottom:"2px"}}>
                  {p.name}, {p.age}
                </div>
                <div style={{fontSize:"12px",color:p.color,marginBottom:"4px"}}>{p.scenarioLabel}</div>
                <div style={{fontSize:"11px",color:C.faint,fontStyle:"italic"}}>
                  "{p.opening.length>80?p.opening.slice(0,80)+"…":p.opening}"
                </div>
              </div>
              <span style={{fontSize:"16px",flexShrink:0,color:C.faint}}>→</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Active conversation screen ──
  return(
    <div style={{padding:"1rem 0"}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"11px"}}>
          <button onClick={reset} style={{background:"transparent",border:"none",cursor:"pointer",
                                          color:C.muted,fontSize:"13px",padding:"0"}}>← Back</button>
          <div style={{width:"36px",height:"36px",borderRadius:"50%",background:persona.color,
                       color:C.onDark,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px"}}>
            {persona.icon}
          </div>
          <div>
            <div style={{fontSize:"14px",fontWeight:"500",color:C.ink}}>{persona.name}</div>
            <div style={{fontSize:"11px",color:C.faint}}>{persona.description}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
          <button onClick={()=>setShowFeedback(!showFeedback)}
            style={{padding:"5px 10px",borderRadius:"8px",fontSize:"11px",cursor:"pointer",
                    border:`0.5px solid ${C.border}`,background:showFeedback?C.softGold:"transparent",
                    color:showFeedback?C.ochre:C.faint}}>
            💡 Feedback
          </button>
          {!sessionDone&&messages.length>3&&(
            <button onClick={endSession}
              style={{padding:"5px 10px",borderRadius:"8px",fontSize:"11px",cursor:"pointer",
                      border:`0.5px solid ${C.green}`,background:C.softGreen,color:C.green}}>
              ✓ End
            </button>
          )}
          <button onClick={onClearKey} title="Change API key"
            style={{padding:"5px 8px",borderRadius:"8px",fontSize:"11px",cursor:"pointer",
                    border:`0.5px solid ${C.border}`,background:"transparent",color:C.faint}}>
            🔑
          </button>
        </div>
      </div>

      {/* Chat messages */}
      <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"14px",
                   maxHeight:"420px",overflowY:"auto",padding:"4px 0"}}>
        {messages.map((msg,i)=>(
          <div key={i} style={{display:"flex",flexDirection:"column",
                               alignItems:msg.role==="user"?"flex-end":"flex-start",gap:"4px"}}>
            {/* Main bubble */}
            <div style={{maxWidth:"82%",background:msg.role==="user"?persona.color:C.surface,
                          border:msg.role==="user"?"none":`0.5px solid ${C.border}`,
                          borderRadius:msg.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",
                          padding:"12px 15px"}}>
              {msg.role==="assistant"&&(
                <div style={{fontSize:"10px",color:persona.color,fontWeight:"500",
                             letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"4px"}}>
                  {persona.name}
                </div>
              )}
              {msg.role==="user"&&(
                <div style={{fontSize:"10px",color:"rgba(248,242,228,0.65)",fontWeight:"500",
                             letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"4px"}}>
                  Irmã Bennett
                </div>
              )}
              <div style={{fontFamily:"Georgia,serif",fontSize:"15px",lineHeight:1.6,
                           color:msg.role==="user"?C.onDark:C.ink}}>
                {msg.pt}
              </div>
              {msg.role==="assistant"&&(
                <button onClick={()=>speakPT(msg.pt,0.78)}
                  style={{marginTop:"7px",background:"transparent",border:`0.5px solid ${C.border}`,
                          borderRadius:"7px",padding:"4px 10px",fontSize:"11px",
                          color:C.faint,cursor:"pointer"}}>
                  🔊 Hear
                </button>
              )}
            </div>
            {/* Grammar feedback */}
            {showFeedback&&msg.feedback&&(
              <div style={{maxWidth:"82%",background:C.softGold,
                           border:`0.5px solid ${C.border}`,borderLeft:`3px solid ${C.gold}`,
                           borderRadius:"10px",padding:"8px 12px",
                           fontSize:"12px",color:C.ochre,lineHeight:1.55}}>
                💡 {msg.feedback}
              </div>
            )}
          </div>
        ))}
        {loading&&(
          <div style={{alignSelf:"flex-start",background:C.surface,border:`0.5px solid ${C.border}`,
                       borderRadius:"16px 16px 16px 4px",padding:"12px 15px",color:C.faint,fontSize:"13px"}}>
            <span style={{fontFamily:"Georgia,serif"}}>{persona.name} está a escrever…</span>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      {/* Session summary */}
      {sessionDone?(
        <div style={{background:C.softGreen,border:`0.5px solid ${C.green}`,borderRadius:"14px",
                     padding:"18px",textAlign:"center"}}>
          <div style={{fontSize:"24px",marginBottom:"6px"}}>🎉</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:"17px",color:C.green,marginBottom:"6px"}}>
            Discussion complete!
          </div>
          <div style={{fontSize:"13px",color:C.muted,marginBottom:"14px",lineHeight:1.6}}>
            You exchanged {messages.filter(m=>m.role==="user").length} messages with {persona.name}. Review your grammar feedback above, then try again with a different persona.
          </div>
          <button onClick={reset}
            style={{background:C.green,border:"none",borderRadius:"11px",
                    padding:"11px 24px",color:C.onDark,fontSize:"14px",
                    fontWeight:"500",cursor:"pointer"}}>
            Try another investigator
          </button>
        </div>
      ):(
        /* Input area */
        <div style={{display:"flex",gap:"8px",alignItems:"flex-end"}}>
          <textarea ref={inputRef} value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}}}
            placeholder="Escreva em Português… (Enter to send, Shift+Enter for new line)"
            style={{flex:1,minHeight:"56px",maxHeight:"120px",padding:"10px 13px",
                    background:C.bg,border:`0.5px solid ${C.border}`,borderRadius:"12px",
                    fontSize:"14px",color:C.ink,fontFamily:"Georgia,serif",
                    resize:"none",boxSizing:"border-box",lineHeight:1.55}}/>
          <button onClick={sendMessage} disabled={loading||!input.trim()}
            style={{width:"48px",height:"48px",borderRadius:"12px",border:"none",
                    background:input.trim()&&!loading?persona.color:C.border,
                    color:C.onDark,fontSize:"20px",cursor:input.trim()?"pointer":"default",
                    flexShrink:0,transition:"background 0.2s"}}>
            {loading?"⏳":"→"}
          </button>
        </div>
      )}
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
//  MISSION READINESS CERTIFICATE (unlocks at 80%+)
// ══════════════════════════════════════════════════════════════════════════════
function Certificate({score,streak}){
  const today=new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});
  return(
    <div id="cert-print" style={{background:"#F2EDD8",border:`3px solid ${C.gold}`,
                                  borderRadius:"16px",padding:"36px 32px",textAlign:"center",
                                  position:"relative",overflow:"hidden",marginTop:"12px"}}>
      {/* Border accent */}
      <div style={{position:"absolute",inset:"6px",border:`1px solid ${C.border}`,borderRadius:"12px",pointerEvents:"none"}}/>
      {/* Flag strip top */}
      <div style={{display:"flex",height:"6px",borderRadius:"4px",overflow:"hidden",marginBottom:"24px"}}>
        <div style={{flex:2,background:C.green}}/><div style={{flex:3,background:C.red}}/>
      </div>
      {/* Crest */}
      <div style={{width:"60px",height:"60px",borderRadius:"50%",background:C.gold,
                   border:`3px solid ${C.green}`,margin:"0 auto 16px",
                   display:"flex",alignItems:"center",justifyContent:"center",fontSize:"26px"}}>
        🇵🇹
      </div>
      <div style={{fontSize:"11px",letterSpacing:"0.3em",textTransform:"uppercase",
                   color:C.muted,marginBottom:"8px"}}>Certificate of Mission Preparation</div>
      <div style={{fontFamily:"Georgia,serif",fontSize:"28px",color:C.green,marginBottom:"6px",
                   fontWeight:"400"}}>Irmã Bennett</div>
      <div style={{fontSize:"13px",color:C.muted,marginBottom:"20px"}}>Portugal Porto Mission · Home MTC</div>
      <div style={{background:C.green,borderRadius:"12px",padding:"16px 24px",marginBottom:"20px",
                   display:"inline-block"}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:"42px",color:C.gold,lineHeight:1}}>{score}%</div>
        <div style={{fontSize:"12px",color:"rgba(248,242,228,0.75)",marginTop:"2px"}}>Mission Readiness</div>
      </div>
      <div style={{fontFamily:"Georgia,serif",fontSize:"15px",color:C.douro,marginBottom:"6px",fontStyle:"italic"}}>
        "Assim, pressionai avante com firmeza em Cristo"
      </div>
      <div style={{fontSize:"12px",color:C.faint,marginBottom:"20px"}}>2 Néfi 31:20</div>
      <div style={{fontSize:"12px",color:C.muted,borderTop:`0.5px solid ${C.border}`,paddingTop:"14px",
                   display:"flex",justifyContent:"space-between"}}>
        <span>Streak: {streak.current||0} days</span>
        <span>{today}</span>
        <span>Home MTC: Oct 28, 2026</span>
      </div>
      {/* Flag strip bottom */}
      <div style={{display:"flex",height:"6px",borderRadius:"4px",overflow:"hidden",marginTop:"20px"}}>
        <div style={{flex:2,background:C.green}}/><div style={{flex:3,background:C.red}}/>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════════════════════
//  ROOT APP — All 10 tabs, Phases 1–4 Complete
// ══════════════════════════════════════════════════════════════════════════════

// API key management — stored in localStorage, used by AI Conversation tab
function useApiKey() {
  const [apiKey,setApiKeyState]=useLS("sb-api-key","");
  const save=(k)=>setApiKeyState(k);
  return [apiKey,save];
}

function ApiKeyPrompt({onSave}){
  const [val,setVal]=useState("");
  return(
    <div style={{background:C.surface,border:`0.5px solid ${C.border}`,borderRadius:"16px",
                 padding:"24px",marginBottom:"16px",borderLeft:`4px solid ${C.gold}`}}>
      <div style={{fontSize:"13px",fontWeight:"500",color:C.ink,marginBottom:"8px"}}>
        🔑 Anthropic API key required for AI Conversation
      </div>
      <p style={{fontSize:"12px",color:C.muted,lineHeight:1.65,marginBottom:"14px"}}>
        The AI Conversation tab uses Claude. To enable it, enter your Anthropic API key below.
        Get one free at <a href="https://console.anthropic.com" target="_blank"
        style={{color:C.azulejo}}>console.anthropic.com</a>. Your key is stored only on this device.
      </p>
      <div style={{display:"flex",gap:"8px"}}>
        <input type="password" value={val} onChange={e=>setVal(e.target.value)}
          placeholder="sk-ant-api03-..."
          style={{flex:1,padding:"9px 12px",background:C.bg,
                  border:`0.5px solid ${C.border}`,borderRadius:"9px",
                  fontSize:"13px",color:C.ink,fontFamily:"monospace"}}/>
        <button onClick={()=>{if(val.startsWith("sk-"))onSave(val);}}
          disabled={!val.startsWith("sk-")}
          style={{background:val.startsWith("sk-")?C.green:C.border,border:"none",
                  borderRadius:"9px",padding:"9px 16px",color:C.onDark,
                  fontSize:"13px",cursor:val.startsWith("sk-")?"pointer":"default"}}>
          Save
        </button>
      </div>
    </div>
  );
}

const TABS=[
  {id:"countdown",  icon:"⏱", pt:"Contagem",      en:"Countdown",     note:"Início da missão · Mission begins"},
  {id:"path",       icon:"🗺", pt:"O Meu Caminho", en:"My Path",       note:"Prontidão · Readiness & plan"},
  {id:"alphabet",   icon:"🔡", pt:"Alfabeto",      en:"Alphabet",      note:"Pronúncia · Pronunciation"},
  {id:"phrases",    icon:"🙏", pt:"Frases",        en:"Phrases",       note:"Vocabulário · Mission vocabulary"},
  {id:"culture",    icon:"🏛", pt:"Cultura",       en:"Culture",       note:"Porto e Portugal · Porto & Portugal"},
  {id:"reader",     icon:"📖", pt:"Leitura",       en:"Reader",        note:"Textos paralelos · Parallel texts"},
  {id:"vocab",      icon:"📚", pt:"Vocabulário",   en:"Vocabulary",    note:"Cartões e quiz · Flashcards & quiz"},
  {id:"speaking",   icon:"🎤", pt:"Falar",         en:"Speaking",      note:"Prática de voz · Voice practice"},
  {id:"scripture",  icon:"📜", pt:"Escrituras",    en:"Scriptures",    note:"Estudo · Study & bookmarks"},
  {id:"ai",         icon:"🤖", pt:"Conversa",      en:"Conversation",  note:"Investigador IA · AI investigator"},
];

export default function App(){
  const [tab,setTab]=useState("countdown");
  const streak=useStreak();
  const [alphaData,saveAlphaData]        =useLS("sb-alpha",     {plays:{}});
  const [phraseData,savePhraseData]      =useLS("sb-phrases",   {plays:{},scores:{},mastered:{}});
  const [cultureData,saveCultureData]    =useLS("sb-culture",   {read:{},vocab:{}});
  const [readerData,saveReaderData]      =useLS("sb-reader",    {progress:{},completed:{}});
  const [vocabData,saveVocabData]        =useLS("sb-vocab",     {heard:{},correct:{}});
  const [speakingData,saveSpeakingData]  =useLS("sb-speaking",  {scores:{},sessions:0});
  const [scriptureData,saveScriptureData]=useLS("sb-scripture", {bookmarks:{},notes:{},heard:{}});
  const [convData,saveConvData]          =useLS("sb-conv",      {sessions:0,totalMessages:0});
  const [apiKey,saveApiKey]              =useApiKey();
  const [showCert,setShowCert]           =useState(false);

  useEffect(()=>{
    if("speechSynthesis" in window){
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged=()=>window.speechSynthesis.getVoices();
    }
  },[]);

  const r=calcReadiness(alphaData,phraseData,vocabData,cultureData,readerData,speakingData);
  const missionReady=r.total>=80;

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Segoe UI',system-ui,-apple-system,sans-serif"}}>

      {/* ── HEADER ── */}
      <div style={{position:"relative",overflow:"hidden"}}>
        <div style={{display:"flex",height:"100%"}}><div style={{flex:"0 0 40%",background:C.green}}/><div style={{flex:"0 0 60%",background:C.red}}/></div>
        <div style={{position:"absolute",inset:0,backgroundImage:`repeating-linear-gradient(45deg,rgba(255,255,255,0.03) 0,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 22px),repeating-linear-gradient(-45deg,rgba(255,255,255,0.03) 0,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 22px)`,backgroundSize:"22px 22px"}}/>
        <div style={{position:"absolute",top:"50%",left:"40%",transform:"translate(-50%,-50%)",width:"46px",height:"46px",borderRadius:"50%",background:C.gold,border:"3px solid rgba(255,255,255,0.25)",zIndex:2,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:"26px",height:"26px",borderRadius:"50%",border:`1.5px solid ${C.red}`,opacity:0.6}}/></div>
        <div style={{position:"relative",zIndex:3,padding:"16px 14px 0",maxWidth:"720px",margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"3px"}}>
            <div>
              <div style={{fontSize:"10px",letterSpacing:"0.2em",color:"rgba(248,242,228,0.65)",textTransform:"uppercase",marginBottom:"2px"}}>🇵🇹 Portugal Porto Mission</div>
              <h1 style={{fontFamily:"Georgia,serif",fontSize:"20px",fontWeight:"400",color:C.onDark,marginBottom:"1px",textShadow:"0 1px 3px rgba(0,0,0,0.3)"}}>Irmã Bennett</h1>
              <div style={{fontSize:"10px",color:"rgba(248,242,228,0.45)",marginBottom:"12px"}}>Português Europeu · All Phases Complete</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"5px",alignItems:"flex-end"}}>
              <StreakBadge streak={streak}/>
              <button onClick={()=>setShowCert(!showCert)}
                style={{background:missionReady?"rgba(4,106,56,0.25)":"rgba(200,165,39,0.18)",border:`0.5px solid ${missionReady?C.green:C.gold}`,borderRadius:"10px",padding:"4px 10px",fontSize:"11px",fontWeight:"500",cursor:"pointer",color:missionReady?C.green:C.gold}}>
                {missionReady?"🏆 "+r.total+"% · Certificate":"🎯 "+r.total+"% ready"}
              </button>
            </div>
          </div>
          {showCert&&missionReady&&<Certificate score={r.total} streak={streak}/>}
          {showCert&&missionReady&&(
            <div style={{padding:"8px 0",textAlign:"center"}}>
              <button onClick={()=>window.print()} style={{background:C.green,border:"none",borderRadius:"9px",padding:"8px 20px",color:C.onDark,fontSize:"12px",cursor:"pointer",marginRight:"8px"}}>🖨 Print certificate</button>
              <button onClick={()=>setShowCert(false)} style={{background:"transparent",border:`0.5px solid ${C.border}`,borderRadius:"9px",padding:"8px 14px",color:C.muted,fontSize:"12px",cursor:"pointer"}}>Close</button>
            </div>
          )}
          {showCert&&!missionReady&&(
            <div style={{background:"rgba(0,0,0,0.3)",borderRadius:"12px",padding:"12px",marginBottom:"8px",textAlign:"center",fontSize:"12px",color:"rgba(248,242,228,0.75)"}}>
              Reach 80% readiness to unlock your certificate. Currently {r.total}% — {80-r.total} points to go!
            </div>
          )}
          {/* ── TAB BAR — large bilingual cards ── */}
          <div style={{
            display:"flex",gap:"5px",overflowX:"auto",paddingBottom:"6px",
            scrollbarWidth:"none",msOverflowStyle:"none",marginTop:"10px",
            WebkitOverflowScrolling:"touch",
          }}>
            {TABS.map(t=>{
              const active=tab===t.id;
              return(
                <button key={t.id} onClick={()=>{setTab(t.id);setShowCert(false);}}
                  style={{
                    flexShrink:0,width:"96px",
                    background:active?C.bg:"rgba(0,0,0,0.45)",
                    border:active?`2px solid ${C.gold}`:`1px solid rgba(255,255,255,0.25)`,
                    borderRadius:"12px 12px 0 0",
                    borderBottom:active?"2px solid "+C.bg:"1px solid rgba(255,255,255,0.25)",
                    padding:"10px 6px 8px",cursor:"pointer",textAlign:"center",
                    transition:"all 0.15s",
                    boxShadow:active?"0 -2px 8px rgba(0,0,0,0.2)":"none",
                  }}>
                  {/* Icon */}
                  <div style={{fontSize:"20px",lineHeight:1,marginBottom:"5px"}}>{t.icon}</div>
                  {/* Portuguese label */}
                  <div style={{
                    fontSize:"12px",fontWeight:"600",lineHeight:1.2,marginBottom:"3px",
                    color:active?C.green:"#FFFFFF",
                    fontFamily:"Georgia,serif",whiteSpace:"nowrap",
                  }}>{t.pt}</div>
                  {/* English label */}
                  <div style={{
                    fontSize:"10px",fontWeight:"400",lineHeight:1.2,marginBottom:"4px",
                    color:active?C.muted:"rgba(255,255,255,0.75)",
                    whiteSpace:"nowrap",
                  }}>{t.en}</div>
                  {/* Active indicator bar */}
                  {active&&(
                    <div style={{
                      width:"18px",height:"3px",borderRadius:"2px",
                      background:C.gold,margin:"0 auto",
                    }}/>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{padding:"0 14px",maxWidth:"720px",margin:"0 auto"}}>
        {tab==="countdown" &&<CountdownView streak={streak} alphaData={alphaData} phraseData={phraseData} cultureData={cultureData} readerData={readerData}/>}
        {tab==="path"      &&<LearningPathView streak={streak} alphaData={alphaData} phraseData={phraseData} vocabData={vocabData} cultureData={cultureData} readerData={readerData} speakingData={speakingData} setTab={setTab}/>}
        {tab==="alphabet"  &&<AlphabetView alphaData={alphaData} saveAlphaData={saveAlphaData}/>}
        {tab==="phrases"   &&<PhrasesView phraseData={phraseData} savePhraseData={savePhraseData}/>}
        {tab==="culture"   &&<CultureView cultureData={cultureData} saveCultureData={saveCultureData}/>}
        {tab==="reader"    &&<ReaderView readerData={readerData} saveReaderData={saveReaderData}/>}
        {tab==="vocab"     &&<VocabView vocabData={vocabData} saveVocabData={saveVocabData}/>}
        {tab==="speaking"  &&<SpeakingLabView speakingData={speakingData} saveSpeakingData={saveSpeakingData}/>}
        {tab==="scripture" &&<ScriptureView scriptureData={scriptureData} saveScriptureData={saveScriptureData}/>}
        {tab==="ai"        &&(
          !apiKey
            ? <ApiKeyPrompt onSave={saveApiKey}/>
            : <AIConversationView convData={convData} saveConvData={saveConvData} apiKey={apiKey} onClearKey={()=>saveApiKey("")}/>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div style={{margin:"36px auto 0",maxWidth:"720px",padding:"14px 16px",borderTop:`0.5px solid ${C.border}`}}>
        <div style={{display:"flex",gap:"9px",alignItems:"center",marginBottom:"5px"}}>
          <FlagStrip width={34} height={6}/>
          <span style={{fontSize:"11px",color:C.faint}}>Sister Bennett's Portuguese Mission App · All 4 Phases Complete 🇵🇹</span>
        </div>
        <div style={{fontSize:"11px",color:C.faint,lineHeight:1.7}}>
          10 modules · All progress saved to localStorage · Daily streak · Mission Readiness Score ·
          🔊 Chrome or Edge for European Portuguese audio ·
          🎤 Microphone required for Speaking Lab ·
          🤖 AI Conversation powered by Claude (requires API key)
        </div>
      </div>
    </div>
  );
}
