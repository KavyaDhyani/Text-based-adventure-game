const terminal = document.getElementById("terminal");
const output = document.getElementById("output");
const input = document.getElementById("input");

// Initial game state
const initialGameState = {
  currentScene: "intro",
  inventory: [],
  choices: {
    defeatedKnight: false,
    helpedLady: false,
    savedBoy: false,
    defeatedWizard: false,
    hasSwordOfLight: false,
  },
  gameOver: false,
  isTyping: false,
};

let gameState = { ...initialGameState };

// Scenes
const scenes = {
  intro: {
    text: `During your childhood, you often dreamed of embarking on a grand adventure, a journey that fueled your imagination and filled your heart with excitement. Now, years later, the monotony of your routine has become unbearable. Tired of the daily grind, you finally decide to break free and pursue the adventure that once lived only in your wildest fantasies.

The path ahead is full of perils, riddled with unknown challenges and untold dangers. But it is also brimming with the promise of discovery, growth, and the fulfillment of your deepest dreams.

Are you ready to take the first step into the unknown? (Type 'yes' or 'no')`,
    choices: {
      yes: "scene1_start",
      no: "game_end",
    },
  },
  game_end: {
    text: "As you wish, not everyone is made for this life.",
    isEnding: true,
  },
  scene1_start: {
    text: "You acquire a Rusty Sword and venture forth.\n\nYou arrive at the dark forest, a perilous realm full of cunning rogues and fearsome monsters.\n\nAs you tread cautiously through the forest, a rogue knight steps into your path, his armor glinting faintly in the dim light. He glares at you with a wicked grin. \"You there! If you've got any gold, you'd best hand it over. Otherwise, I might just let my friends in the forest have their fun with you.\"\n\nWhat will you do? (Type 'fight' or 'run')",
    onEnter: () => {
      gameState.inventory = ["Rusty Sword"];
    },
    choices: {
      fight: "knight_fight",
      run: "knight_escape",
    },
  },
  knight_fight: {
    text: "You take a deep breath and draw your sword, getting into stance to take on the evil that blocks your path. You two fight head to head, not giving each other even a single opening, but alas your youth bested the aging knight and you manage to impale him on your sword.\n\nYou acquire the Knight's Sword!\n\n(Type 'continue')",
    onEnter: () => {
      gameState.inventory = gameState.inventory.filter(
        (item) => item !== "Rusty Sword"
      );
      gameState.inventory.push("Knight's Sword");
      gameState.choices.defeatedKnight = true;
    },
    next: "scene2",
  },
  knight_escape: {
    text: "You run as fast as your feet can carry you and somehow manage to escape.\n(Type 'continue')",
    next: "scene2",
  },
  scene2: {
    text: "As you continue on your path, you come across an old lady sitting on a rock, sobbing. Apparently she had come looking for her grandson and had got lost. She requests you to escort her to her village.\n\nWhat will you do? (Type 'escort' or 'refuse')",
    choices: {
      escort: "escort_lady",
      refuse: "refuse_lady",
    },
  },
  escort_lady: {
    text: 'You accompany the old lady to her village, the journey quiet but filled with unspoken gratitude. As you prepare to part ways, she clasps your hand and with a trembling smile, urges, "Please, if you can, find my grandson." In exchange, she hands you a small vial of shimmering liquid, its glow promising strength and vitality. "Take this, for the road ahead," she whispers.\n\nYou acquire the Vial of Health!\n(Type "continue")',
    onEnter: () => {
      gameState.inventory.push("Vial of Health");
      gameState.choices.helpedLady = true;
    },
    next: "scene3",
  },
  refuse_lady: {
    text: "You decline her offer and continue on your way. Suddenly, the blood-curdling shriek of the woman pierces the air, sending a chill down your spine. Without hesitation, you sprint, heart pounding, desperate to escape whatever horrors lie behind you.\n(Type 'continue')",
    next: "scene3",
  },
  scene3: {
    text: 'After days of relentless travel, you find a large tree and decide to rest beneath its shade. Just as your eyes begin to close, a dagger whizzes past, embedding itself in the trunk next to your head. Instantly, you leap to your feet, sword drawn, ready for whatever threat lies ahead. From a nearby tree, an assassin drops down with a mocking grin. "Judging by the size of your bag, looks like you\'ve got some nice treasures over there. Would be a shame if someone were to take them."\n(Type "continue")',
    next: (state) => {
      if (!state.choices.defeatedKnight && !state.choices.helpedLady)
        return "assassin_death";
      if (!state.choices.defeatedKnight && state.choices.helpedLady)
        return "assassin_vial";
      return "assassin_victory";
    },
  },
  assassin_death: {
    text: "The assassin dashes towards you, daggers in his hand and strikes. Your old blade shatters immediately and the assassin drives one of his daggers through your chest. You fall into an eternal slumber as the assassin walks away with your belongings.",
    isEnding: true,
  },
  assassin_vial: {
    text: "The assassin dashes towards you, daggers in his hand and strikes. Your old blade shatters immediately and the assassin drives one of his daggers through your chest. As the assassin stands over his loot, with your remaining strength you manage to drink the vial the old lady gave you and instantly heal. You quickly grab a large rock and with all your strength hit the distracted assassin on the head. The assassin immediately passes out.\n\nYou acquire the Assassin's Daggers!\n(Type 'continue')",
    onEnter: () => {
      gameState.inventory = gameState.inventory.filter(
        (item) => item !== "Rusty Sword" && item !== "Vial of Health"
      );
      gameState.inventory.push("Assassin's Daggers");
    },
    next: "scene4",
  },
  assassin_victory: {
    text: "The assassin dashes towards you, daggers in his hand and strikes. You block the attack with your new sword and push him back. As he stumbles, you seize the moment, launching a precise counterattack. In one fluid motion, your blade cuts through the air, catching him off guard and landing a decisive blow. The assassin crumples to the ground, defeated, his daggers slipping from his grasp.\n\nYou acquire the Assassin's Daggers!\n(Type 'continue')",
    onEnter: () => {
      gameState.inventory.push("Assassin's Daggers");
    },
    next: "scene4",
  },
  scene4: {
    text: "After days of travel, you stumble upon a serene lake, its surface shimmering under the sun. Suddenly, your peaceful moment is shattered by desperate cries for help echoing through the trees. You quickly investigate and find a young boy surrounded by a band of orcs. What will you do?\n\n(Type 'help' or 'leave')",
    choices: {
      help: "save_boy",
      leave: "abandon_boy",
    },
  },
  save_boy: {
    text: "With a swift motion, you draw your daggers and charge toward the orcs. Their snarls are cut short as your blades flash through the air, striking with precision. One by one, they fall before you, their advance halted with deadly ease. The fight ends as quickly as it began, the last orc crumpling to the ground in defeat. You find out that the boy is the lost grandson of the old lady and decide to take him with you. As a thank you, he gives you the Knight's Sword. \n\nYou acquire the Knight's Sword!\n(Type 'continue')",
    onEnter: () => {
      if (!gameState.choices.defeatedKnight) {
        gameState.inventory.push("Knight's Sword");
      }
      gameState.choices.savedBoy = true;
    },
    next: "scene5",
  },
  abandon_boy: {
    text: "You decide to have nothing to do with the orcs' business and silently return to the lake, leaving the young soul to its inevitable fate.\n(Type 'continue')",
    next: "scene5",
  },
  scene5: {
    text: (state) => {
      if (state.choices.savedBoy) {
        return "You and your companion travel late into the night, the moon casting long shadows across the path. As you round a bend, you spot an eerie clearing ahead, its ground marked with strange symbols and flickering candlelight. A ritual seems to be in progress. Suddenly, a gust of wind sweeps through the clearing, extinguishing the flames of the candles in an instant. You hear footsteps approaching, and then you see him, a wizard possessed by evil, only the white of his eyes visible, sneering at you two.\"\n\nWhat will you do? (Type 'fight' or 'run')";
      } else {
        return "You travel late into the night, the moon casting long shadows across the path. As you round a bend, you spot an eerie clearing ahead, its ground marked with strange symbols and flickering candlelight. A ritual seems to be in progress. Suddenly, a gust of wind sweeps through the clearing, extinguishing the flames of the candles in an instant. You hear footsteps approaching, and then you see him, a wizard possessed by evil, only the white of his eyes visible, sneering at you.\"\n\nWhat will you do? (Type 'fight' or 'run')";
      }
    },
    choices: {
      fight: "wizard_fight",
      run: "wizard_escape",
    },
  },
  wizard_fight: {
    text: (state) => {
      if (state.choices.savedBoy) {
        return 'The wizard hurls a fireball at you, forcing both of you to leap aside. The boy shouts, "I know how to defeat him! We must strike his shadow to banish the evil!" The fireball sets a tree ablaze, and you grin, dodging fireballs as the surroundings catch fire. Once enough light fills the area, the boy distracts the wizard, and you throw your daggers at his shadow, then thrust your sword into it. The wizard shrieks and collapses. He wakes, free from the evil, and thanks you. As you prepare to leave, he hands you the Mystical Cloak. "May this guide and protect you!"\n(Type "continue")';
      } else {
        return "The wizard hurls a fireball at you, forcing you to leap aside. Before you have even recovered another fireball hits you directly, seering your flesh and sends you flying in the distance. You succumb to an eternal slumber, the wizard's cackling echoing into the night, chilling the air with its sinister glee.";
      }
    },
    onEnter: (state) => {
      if (state.choices.savedBoy) {
        state.inventory.push("Mystical Cloak");
        state.choices.defeatedWizard = true;
        return "scene6";
      }
      
    },
    next: (state) => (state.choices.savedBoy ? "scene6" : undefined),
    isEnding: (state) => !state.choices.savedBoy,

  },
  wizard_escape: {
    text: (state) => {
      if (state.choices.savedBoy) {
        return "The wizard hurls fireball after fireball at you two as you make a run for it, not stopping until you have reached a safe place.\n(Type 'continue')";
      } else {
        return "The wizard hurls fireball after fireball at you as you make a run for it, not stopping until you have reached a safe place.\n(Type 'continue')";
      }
    },
    next: "scene6",
  },
  scene6: {
    text: (state) => {
      if (state.choices.savedBoy) {
        return "After days of travel, you and your companion arrive at the village where you once escorted the old lady. Her eyes light up with joy as she sees the boy. Rushing forward, she pulls him into a tight embrace, her laughter filling the air as the villagers cheer around them. The reunion is one of pure happiness, a heartwarming sight after your long journey.\n\nThe village elder approaches and leads you to a sacred shrine where a sword, radiant even in its stillness, stands buried in the ground to the hilt. \"This is the Sword of Light, my child. Only the purest of souls can draw it forth. Would you like to try?\"\n\n(Type 'draw' to attempt to draw the sword)";
      } else {
        return 'After days of travel, you arrive at the village where you had once escorted the old lady. A heavy sorrow hangs in the air, blanketing the village in silence broken only by hushed whispers and muffled sobs. Following the commotion, you find the same old woman, her cries piercing through the gloom. She collapses to her knees, wailing, "They\'ve taken him! My grandson—offered to Thraxxion the Devourer!"\n\nThe village elder approaches and leads you to a sacred shrine where a sword, radiant even in its stillness, stands buried in the ground to the hilt. "This is the Sword of Light, my child. Only the purest of souls can draw it forth. Would you like to try?"\n\n(Type \'draw\' to attempt to draw the sword)';
      }
    },
    choices: {
      draw: "sword_attempt",
    },
  },
  sword_attempt: {
    text: (state) => {
      if (state.choices.savedBoy) {
        return 'With a firm grip, you pull the sword from the ground with ease. It emerges effortlessly, shimmering with a golden aura that lights up the surrounding area, as if it recognizes the worth of its wielder. The blade radiates power, its brilliance casting a warm glow in the still air.\n\nThe elder\'s voice grows solemn as he speaks of a monster that has plagued their village for years. "This beast, Thraxxion the Devourer, has terrorized us, taking our people and instilling fear in every corner of the land. We have tried to rid ourselves of it, but none have succeeded. I ask you, traveler, to end its tyranny and bring peace to our people.\n(Type "continue")"\n\nYou acquire the Sword of Light!';
      } else {
        return 'You grip the hilt firmly and pull with all your might, straining against the sword\'s unyielding grip on the earth. Despite your best efforts, it refuses to budge. The elder sighs, his expression heavy with disappointment. "Alas, you are not our fated savior."\n\nYou leave the village, swearing to vanquish the evil that had brought such sorrow upon the village.\n(Type "continue")';
      }
    },
    onEnter: (state) => {
      if (state.choices.savedBoy) {
        state.inventory = state.inventory.filter(
          (item) => item !== "Knight's Sword"
        );
        state.inventory.push("Sword of Light");
        state.choices.hasSwordOfLight = true;
      }
    },
    next: "scene7",
  },
  scene7: {
    text: "With unwavering resolve, you make your way toward the lair of Thraxxion the Devourer. The path ahead is treacherous, but nothing can deter you now. The ground trembles beneath you, and the air thickens with dark energy. From the depths of the cave, something monstrous begins to emerge. Out steps an eight-foot-tall, red-skinned orc, its tusks replacing teeth, and its hulking frame more beast than being. The creature lets out a bone-shaking roar.\n\nWhat will you do? (Type 'fight' or 'run')",
    choices: {
      fight: "final_battle",
      run: "final_escape",
    },
  },
  final_battle: {
    text: (state) => {
      if (state.choices.hasSwordOfLight) {
        return "You draw your Sword of Light, your hands steady despite the horror building in your chest. The orc, enraged, swings the massive club at you. You barely have time to react to get out of the way but still take on a shaking force as it thumps into the earth close to your body. Seizing this window of opportunity, you stab the sword into his hand, forcing him to let go of the club with an enraged yowl.\nBut before you can react, his monstrous arm swats you away with ease. You prepare for the impact, but to your amazement, you feel weightless, as if you are floating. The Mystical Cloak, draped over your shoulders, pulsates with an energy that enables you to defy gravity.\n\nThe Sword of Light pulses with an intense golden aura. The energy surges through you, reviving your body and sharpening your senses. The orc's swats barely hit by inches as you float above his attacks with ease.\n\nYou quickly regain your balance, scanning for an opening. Spotting one, you dash towards the orc's head with incredible speed, the cloak granting you unparalleled agility. You leap toward his skull, your sword raised high. With one powerful strike, the sword pierces through his thick hide, driving deep into his brain. The orc lets out a final, bone-rattling roar before collapsing to the ground, lifeless.\n(Type 'continue')";
      } else {
        return "You draw your sword, your hands steady despite the horror building in your chest. The orc, enraged, swings the massive club at you. You barely have time to react to get out of the way but still take on a shaking force as it thumps into the earth close to your body. Seizing this window of opportunity, you stab the sword into his hand, forcing him to let go of the club with an enraged yowl.\n\nBut before you can react, his monstrous arm swats you away with ease. You crash into the cave wall, the impact knocking the breath from your lungs. You hit the ground hard, blood seeping from your mouth, and your vision begins to blur. As your strength fades, you feel the orc's cruel grip tighten around you. With a chilling snarl, he lifts you up, bringing you closer to his gaping mouth. Your world fades to darkness, the last thing you see being the beast's monstrous teeth closing in.";
      }
    },
    next: (state) => {
      if (
        state.choices.hasSwordOfLight ||
        state.inventory.includes("Mystical Cloak")
      ) {
        return "ending";
      }
      return undefined;
    },
    isEnding: (state) =>
      !(
        state.choices.hasSwordOfLight ||
        state.inventory.includes("Mystical Cloak")
      ),
  },
  final_escape: {
    text: "Heart pounding, you turn on your heels and sprint, fleeing from the terrifying sight of Thraxxion and the chanting orcs. The ground beneath you shakes, but you don't look back, driven by sheer instinct to escape the nightmare unfolding behind you. You push through the underbrush, your breath ragged and legs aching, never daring to glance over your shoulder. So much for seeking adventure—you realize, with a bitter laugh, that this is one terror you can't face.",
    next: "ending_escape",
  },
  ending: {
    text: (state) => {
      if (state.choices.defeatedWizard) {
        return "You return to the village, a sense of pride and relief swelling in your chest as you see the people free from the grip of the monster's tyranny. The villagers greet you with cheers and gratitude, their faces lit with joy. After a well-earned day of feasting, laughter, and stories, you rest, savoring the warmth of their company.\n\nThe next morning, with the village in peace and your heart content, you bid them farewell. Another adventure awaits, and the path calls to you once more.\n\nThe End.";
      } else {
        return "You return to the village, your heart swelling with pride and ease at the thought of the monster's tyranny finally ended. But as you approach, the air grows thick with smoke, and the acrid scent of burning wood fills your lungs. Your steps quicken, and soon the horrifying sight comes into view—the entire village lies ablaze, flames consuming the homes and fields you had fought to protect.\n\nThrough the chaos, you hear desperate cries and see shadowy figures fleeing into the forest. Among the inferno stands a lone figure, cloaked in darkness, staff crackling with malevolent energy. The mad wizard's sneering laughter cuts through the crackling flames, his glowing eyes fixed on you.\n\nYou stand frozen, the weight of your failure crushing down on you. The village you sought to save has been reduced to ash, its people scattered or lost. For all is lost. Unable to bear the devastation, you turn away, the cries and flames haunting your every step as you leave, never to return.\n\nThe End.";
      }
    },
    isEnding: true,
  },
  ending_escape: {
    text: "You continue running until you reach the edge of the forest, your adventure ending not with glory, but with the bitter taste of retreat. Perhaps some battles are meant to be fought another day, by heroes with more courage than you could muster today.\n\nThe End.",
    isEnding: true,
  },
};

// Text typing effect
async function typeText(text, element, speed = 30) {
  gameState.isTyping = true;
  let index = 0;
  element.classList.add("typing");

  return new Promise((resolve) => {
    function type() {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        terminal.scrollTop = terminal.scrollHeight;
        setTimeout(type, speed);
      } else {
        element.classList.remove("typing");
        gameState.isTyping = false;
        resolve();
      }
    }
    type();
  });
}

// Display output
async function displayText(text, className = "") {
  const p = document.createElement("p");
  p.className = className;
  output.appendChild(p);
  await typeText(text, p);
  terminal.scrollTop = terminal.scrollHeight;
}

//Display inventory
async function displayInventory() {
  if (gameState.inventory.length > 0) {
    await displayText(
      "\nInventory: " + gameState.inventory.join(", "),
      "item-text"
    );
  }
}


//Restart game
async function restartGame() {
  // Clear the terminal
  output.innerHTML = "";

  // Reset game state
  gameState = {
    ...initialGameState,
    isTyping: false,
    gameOver: false,
  };

  // Re-enable input if it was disabled
  input.disabled = false;

  // Start the game from the beginning
  await changeScene("intro");

  await displayText(
    "\nGame restarted! Type your choices to begin.",
    "success-text"
  );
}

//Processsing user input
async function processInput(value) {
  if (gameState.isTyping) return;

  const currentScene = scenes[gameState.currentScene];
  await displayText(`>> ${value}`);

  // Check for restart command
  if (value.toLowerCase() === "restart") {
    await restartGame();
    return;
  }

  if (currentScene.choices && currentScene.choices[value.toLowerCase()]) {
    const nextScene = currentScene.choices[value.toLowerCase()];
    await changeScene(nextScene);
  } else if (currentScene.next) {
    if (typeof currentScene.next === "function") {
      await changeScene(currentScene.next(gameState));
    } else {
      await changeScene(currentScene.next);
    }
  } else {
    await displayText(
      'Invalid choice. Try again. Type "restart" to start over.',
      "warning-text"
    );
  }
}


//Change scene
async function changeScene(sceneName) {
  if (!sceneName || !scenes[sceneName]) return;

  gameState.currentScene = sceneName;
  const scene = scenes[sceneName];

  if (scene.onEnter) {
    scene.onEnter(gameState);
  }

  const text =
    typeof scene.text === "function" ? scene.text(gameState) : scene.text;
  await displayText("\n" + text);
  await displayInventory();

  if (
    scene.isEnding ||
    (typeof scene.isEnding === "function" && scene.isEnding(gameState))
  ) {
    gameState.gameOver = true;
    await displayText(
      '\nGame Over. Type "restart" to play again.',
      "warning-text"
    );
  }
}

input.addEventListener("keypress", async (e) => {
  if (e.key === "Enter" && !gameState.isTyping) {
    const value = input.value.trim();
    if (value) {
      input.value = "";
      await processInput(value);
    }
  }
});

// Start the game
changeScene("intro");
