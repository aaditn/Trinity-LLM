'use client';

import {useState, useCallback, useEffect, useRef} from 'react';
import Link from 'next/link'
import { useChat } from 'ai/react';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Transition } from '@headlessui/react'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { nanoid } from 'nanoid'
import GlobalHeader from './components/GlobalHeader'
import GlobalFooter from './components/GlobalFooter'
import React from 'react';


function SkillsDropdown({data, onSelectedSkillParent}) {
  const [skills, setSkills] = useState(data.skills)
  const [selectedSkill, setSelectedSkill] = useState(skills[0])

  const onSelectedSkillChild = (skill: any) => {
    setSelectedSkill(skill)
    onSelectedSkillParent(skill)
  }

  return (
    <Listbox value={selectedSkill} onChange={(skill) => {onSelectedSkillChild(skill)}}>
      <ListboxButton>{selectedSkill.name}</ListboxButton>
      <ListboxOptions anchor="bottom" className="">
        {skills.map((skill) => (
          <ListboxOption key={skill.id} value={skill} className="group flex gap-2 bg-white data-[focus]:bg-blue-100">
            <CheckIcon className="invisible size-5 group-data-[selected]:visible" />
            {skill.name}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}

function blahblah() {
    /* 
    <Combobox immediate value={selectedSkill} 
              onChange={(skill) => {onSelectedSkillChild(skill)}}
              onClose={() => setQuery('')}>
      <ComboboxInput
        aria-label="Soft Skill"
        displayValue={(skill) => skill?.name}
        onChange={(event) => setQuery(event.target.value)}
      />
      <ComboboxOptions anchor="center start" className="empty:hidden">
        {filteredSkills.map((skill) => (
          <ComboboxOption key={skill.id} value={skill} className="data-[focus]:bg-blue-100">
            {skill.name}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
    */
}


function LevelDropdown({data, onSelectedLevelParent}) {
  const levels = data.levels
  const [selectedLevel, setSelectedLevel] = useState(levels[0])
  const [query, setQuery] = useState('')

  const onSelectedLevelChild = (level: any) => {
    setSelectedLevel(level)
    onSelectedLevelParent(level)
  }
  const filteredLevels =
    query === ''
      ? levels
      : levels.filter((level) => {
          return level.name.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <Combobox immediate value={selectedLevel} 
              onChange={(level) => {onSelectedLevelChild(level)}}
              onClose={() => setQuery('')}>
      <ComboboxInput
        aria-label="Level"
        displayValue={(level) => level?.name}
        onChange={(event) => setQuery(event.target.value)}
      />
      <ComboboxOptions anchor="center start" className="empty:hidden">
        {filteredLevels.map((level) => (
          <ComboboxOption key={level.id} value={level} className="data-[focus]:bg-blue-100">
            {level.name}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  )
}

export default function Chat() {
  const { messages, setMessages, input, setInput, handleInputChange, handleSubmit, isLoading } = useChat();
  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const [stage, setStage] = useState(0)
  const [skill, setSkill] = useState("")

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages]);

  useEffect(() => {
    console.log(`isLoading changed ... ${isLoading} stage = ${stage}`)
    if (!isLoading) {
      if (stage == 1) {
        setupPreTrainingAnswer()
        setStage(stage + 1)
      } else if (stage == 2 || stage == 3 || stage == 4) {
        setupRandomTrainingQuestion()
        setStage(stage + 1)
      } else if (stage == 5) {
        setupPostTrainingAnswer()
        setStage(stage + 1)
      } else {
        console.log(`Stage ${stage} not coded yet`)
      }
    }
  }, [isLoading])

  const skills = [
    { id: 0, name: 'Skill' },
    { id: 1, name: 'Communication' },
    { id: 2, name: 'Entrepreneurship' },
    { id: 3, name: "Compassion" },
    { id: 4, name: 'Creativity' },
    { id: 5, name: 'Commitment' },
  ]
  const levels = [
    { id: 0, name: 'Level' },
    { id: 1, name: 'Elementary' },
    { id: 2, name: 'Intermediate' },
    { id: 3, name: 'Advanced' },
  ]

  const questions = [
    { id: 1, name: 'How do you think Emily might be feeling in this new environment? What challenges might she be facing?'},
    { id: 2, name: 'How can we show compassion and empathy towards Emily?'},
    { id: 3, name: 'What actions can we take to make her feel welcome and included in our school community?'},
    { id: 4, name: 'How can we overcome any language or cultural barriers that may exist?'},
    { id: 5, name: 'What are some strategies we can use to encourage other students to be compassionate and inclusive towards Emily?'},
    { id: 6, name: 'How can we create an environment where everyone feels valued and accepted, regardless of their background or circumstances?'},
    { id: 7, name: 'What support systems or resources can we tap into to assist Emily in her transition?'},
    { id: 8, name: "How can we address any potential stereotypes or biases that may arise in relation to Emily's cultural background?"},
    { id: 9, name: 'How can we promote a culture of kindness and compassion within our school community beyond this specific scenario?'},
    { id: 10, name: 'What are the long-term benefits of practicing compassion and empathy towards others?'},
  ]

  const setupScenario = (skill: any) => {
    const prompt = `Imagine you're a teacher trying to teach the skill of ${skill.name} to high school students. You want to use a scenario based learning approach to teach that skill. Can you come up with a scenario for class discussion.`
    setInput(prompt)
  }

  const setupPreTrainingAnswer = () => {
    let messages2 = structuredClone(messages)
    const id = nanoid(7)
    messages2.push({
      id: id,
      role: "assistant",
      content: `Please write a few sentences on ${skill.name} to test your mastery.`,
      createdAt: new Date()
    });
    setMessages(messages2)
  }

  const setupRandomTrainingQuestion = () => {
    const randIdx = Math.floor(Math.random() * questions.length);
    let messages2 = structuredClone(messages)
    const id = nanoid(7)
    messages2.push({
      id: id,
      role: "assistant",
      content: questions[randIdx].name,
      createdAt: new Date()
    });
    setMessages(messages2)
  }

  const setupPostTrainingAnswer = () => {
    let messages2 = structuredClone(messages)
    const id = nanoid(7)
    messages2.push({
      id: id,
      role: "assistant",
      content: "Now please write a few sentences on the skill you would like to master once more, recalling what you have learned since then.",
      createdAt: new Date()
    });
    setMessages(messages2)
  }

  const onSelectedSkill = (skl: any) => {
    console.log("SKILL: ", skl)
    setSkill(skl)
    setStage(1)
    setupScenario(skl)
  }

  const onSelectedLevel = (level: any) => {
    console.log("LEVEL: ", level)
  }

  const handleSubmitAfterPrep =(e) => {
    console.log("stage = ", stage, input)
    if (stage == 2) {
      // setInput(input + "\nPlease evaluate the preceding paragraph. Please summarize and grade this writing.\n")
      // console.log("AFTER IN HERE NOW: ", input)
    }
    if ([1, 2, 3, 4, 5, 6, 7].includes(stage)) {
      handleSubmit(e)
    }
    
  }

  /*
  const handleButtonSubmit = (e: any) => {
    console.log(e)
    // setInput("Hello, how are you?")
    // setTimeout(() => {
    //   handleSubmit(e)
    //   setInput("");
    //   setMessages([])
    // }, 100)
  }
  */

  return (
    <div className="h-screen flex flex-col">
      <GlobalHeader/>
      <div className="flex w-full">
        <div className="flex w-1/12 bg-gray-100"></div>
        <div className="flex mx-auto mb-auto w-5/6">
          <div className="w-full h-[calc(80vh-4rem)] sticky top-16 overflow-y-scroll overscroll-contain bg-gradient-to-b from-gray-50 to-gray-50">
            <div className="h-[400px] text-sm">
              {messages.map(m => (
                m.role === 'user' ?
                <div key={m.id} className="whitespace-pre-wrap text-red-700"><br/><b>User</b>: {m.content}</div>
                :
                <div key={m.id} className="whitespace-pre-wrap text-gray-800"><br/><b>AI</b>: {m.content}</div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
        <div className="flex w-1/12 bg-gray-100"></div>
      </div>

      
      <div className="flex w-full">
        <div className="flex w-1/12 bg-gray-100"></div>
        <div className="flex mx-auto w-5/6 border rounded border-gray-300">
          <textarea
            className="mx-auto w-2/3 mt-2 mb-2 ml-2 text-sm border border-gray-200 rounded shadow-xl"
            value={input}
            rows={4}
            placeholder="Ask me something ..."
            onChange={handleInputChange}
          />
          <div className="flex m-auto w-1/3 p-2">
            <div className="flex w-3/5">
              <div className="ml-10">
                <SkillsDropdown onSelectedSkillParent={onSelectedSkill} data={{skills: skills}}/>
              </div>
            </div>
            <div className="w-2/5">
              <button className={`m-auto w-2/3 ${isLoading ? 'bg-blue-100 text-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'} text-sm  font-bold py-2 px-4 rounded-full`}
                onClick={handleSubmitAfterPrep}
                disabled={isLoading}>
                Submit
              </button>
            </div>
          </div>
        </div>
        <div className="flex w-1/12 bg-gray-100"></div>
      </div>
      <GlobalFooter/>
    </div>
  );
}
