import { nanoid } from "nanoid";
import { useState,useEffect } from "react";
import { getCookieValue,setCookieValue } from "@/helpers/cookies";


const ANIMALS = [
    "trash-panda",
    "party-parrot",
    "ninja-turtle",
    "grumpy-goat",
    "funky-monkey",
    "sassy-seal",
    "chaotic-goose",
    "judgy-cat",
    "curious-fox",
    "cosmic-otter",
    "pixel-panda",
    "debug-duck",
    "server-sloth",
    "binary-bear",
    "async-axolotl",
    "cache-cat",
    "derpy-panda",
    "wobbly-duck",
    "chonky-cat",
    "sneaky-ferret",
    "sleepy-sloth",
    "confused-owl",
    "dramatic-llama",
    "spicy-penguin",
    "Greedy Lannister",
    "Cunning Stark",
    "Ruthless Bolton",
    "Proud Tyrell",
    "Savage Greyjoy",
    "Cold Targaryen",
    "Silent Martell",
    "Iron Baratheon",
    "Vengeful Frey",
    "Watchful Arryn",
    "Bitter Clegane",
    "Shadow Reed",
    "Broken Snow",
    "Stormborn Rivers",
    "Blackwater Pyke",
    "Ashen Sand",
    "Crimson Hill",
    "Nightfall Royce",
    "Grim Karstark",
    "Frostbitten Umber"

  ];
  
  
  const generateUsername = () => {
    const word = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
    return `anonymous-${word}-${nanoid(6)}`
  }
    

export const useUsername=()=>{
    const [username, setUsername] = useState("");
    useEffect(() => {
        const main = async () => {
          const stored = await getCookieValue('STORAGE_KEY');
          if (stored) {
            setUsername(stored);
          } else {
            const newUsername = generateUsername();
            await setCookieValue('STORAGE_KEY', newUsername);
            setUsername(newUsername); // update the state with the new username
          }
        }
        main();
      }, []); 

      return {username}
} 