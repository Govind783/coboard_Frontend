import React from 'react'
import prodShowcaseImage1 from "../../assets/prodShowcaseImage1.webp"
import prodShowcaseImage2 from "../../assets/prodShowcaseImage2.webp"
import prodShowcaseImage3 from "../../assets/prodShowcaseImage3.webp"
import prdImageForAccordion1 from "../../assets/prodShowcaseImgaccordion1.png"
import prdImageForAccordion2 from "../../assets/prodShowcaseImgaccordion2.png"
import prdImageForAccordion3 from "../../assets/prodShowcaseImgaccordion3.png"
import prdImageForAccordion4 from "../../assets/prodShowcaseImgaccordion4.png"
import bikeImage from "../../assets/collabIllustration.svg"
import Image from 'next/image'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import avatargirl1 from "../../assets/avatar1Girl.png"
import avatargirl2 from "../../assets/avatar2Girl.png"
import avatarBoy1 from "../../assets/avatar1Boy.png"
import avatarBoy2 from "../../assets/avatar2Boy.png"
import avatarBoy3 from "../../assets/avatar3Boy.png"


const ProductFeaturesShowcase = () => {
  const arrayOfProductFeatures = [
    {
      'title': "Strategize & plan",
      'description': "Ensure continuous alignment with customer needs and company strategy. Define goals and initiatives, visualize priorities and dependencies, and finally, watch your plans pay off. Everything is easier when you never run out of space.",
      'image': prodShowcaseImage1,
    },
    {
      'title': "Design customer-centric solutions",
      'description': 'Foster a customer-centric mindset and build a mutual team space, where everyone can capture insights, structure them with diagrams and tables, and share it all in a central spot',
      'image': prodShowcaseImage2,
    },
    {
      'title': "Develop your products & services",
      'description': 'Accelerate time to market with a full suite of capabilities designed for innovation, including diagramming, real-time data visualization, and workshop facilitation. CoBoard also gives you built-in support for common product development processes, with agile practices like estimation and retrospectives.',
      'image': prodShowcaseImage3,
    }
  ]

  const accordionItems = [
    {
      'title': 'Workshops & async collaboration',
      'description': 'Unlock faster, more engaged and more productive feedback cycles for deep collaborative work. By bringing together slides, real-time data visualizations, action items, and diagrams, you’ll have everything you need to make good decisions, collected on a single board.',
      'image': prdImageForAccordion1
    },
    {
      'title': 'Diagramming & process mapping',
      'description': 'One user-friendly, intuitive workspace to visualize complex systems, ideas, and organizational structures, allowing teams to: get started faster, automate time-consuming tasks, and bring products and software to market more efficiently.',
      'image': prdImageForAccordion2
    },
    {
      'title': 'Visual project management',
      'description': 'Speed up delivery and improve outcomes by visualizing complex projects at a glance. Understand relationships and dependencies between tasks using dynamic visual aids such as CoBoard Cards, Kanbans, and Flow Charts, as well as integrations with popular task management tools including Smartsheet, Monday.com, Asana, ClickUp, Jira, and Azure DevOps.',
      'image': prdImageForAccordion3
    },
    {
      'title': 'Product development workflows',
      'description': 'CoBoards built-in capabilities for lo-fi wireframing, estimations, dependency mapping, private retrospectives, and scaled product planning are complemented by a powerful two-way sync with Jira to manage end-to-end workflows in a visual and collaborative surface.',
      'image': prdImageForAccordion1
    },
    {
      'title': 'Content and data visulaziation',
      'description': "Visualize the big picture, share context, and make better decisions. From documentation to designs, survey results, videos, and live data, you can easily aggregate synced information from across your tech stack into a CoBoard board. All you need to do is to leverage our powerful integrations through CoBoard smart links.",
      'image': prdImageForAccordion4
    },
  ]
  return (
    <div className='w-full h-full mt-32'>
      <div className="text-center mb-16 lg:text-6xl text-xl secondaryTextColorGray w-full">
        <div>Next big thing?
          <span className='linear-wipe font-semibold'>No big deal.</span>
        </div>
        <div className='mt-3'>Three simple keys to the
          <span className='linear-wipe font-semibold'>future.</span>
        </div>
      </div>
      <div className="flex flex-col gap-12">
        {arrayOfProductFeatures.map((item, index) => {
          return (
            <div key={index}>
              <div className="flex justify-between items-center gap-8 lg:pr-10 lg:pl-16 largeContainer flex-wrap px-4">
                <div className="flex gap-4 flex-col items-start">
                  <p className='font-semibold text-xl'>{item.title}</p>
                  <p className='lg:w-[24rem] leading-[18px] secondaryTextColorGray text-sm'>{item.description}</p>
                </div>
                <Image src={item.image} alt="product showcase image" className='rounded-md lg:w-[50rem] lg:h-[29rem]' />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-20">
        <div className="flex items-start justify-between lg:pr-12 lg:pl-16 px-5 w-full flex-wrap lg:flex-nowrap">
          <div>
            <div className=" mb-6 lg:text-4xl items-start">
              <p>Six core capabilities.</p>
              <p>Six ways to accelerate</p>
              <p>innovation</p>
            </div>
            <p className='lg:w-[29rem] secondaryTextColorGray text-sm'>CoBoard offers sophisticated bundles of capabilities built for all stages of innovation, from diagramming to workshops to code reviews, in a single integrated workspace designed for large-scale collaboration, eliminating tool silos and costs.</p>

            <div className="flex items-center mt-6 gap-1">
              <Image src={avatarBoy1} className='w-8 h-8 rounded-full' />
              <Image src={avatargirl1} className='w-8 h-8 rounded-full' />
              <Image src={avatarBoy2} className='w-8 h-8 rounded-full' />
              <Image src={avatarBoy3} className='w-8 h-8 rounded-full' />
              <Image src={avatargirl2} className='w-8 h-8 rounded-full' />
            </div>
            {/* <Image src={bikeImage} alt='bike' className=' w-[28rem] h-auto' /> */}
          </div>

          <div className='lg:pl-32 w-full mt-5 lg:mt-0'>
            <Accordion type="single" collapsible className="w-full border-0">
              {
                accordionItems.map((item, index) => {
                  return (
                    <AccordionItem value={`item-${index}`} key={index} className="border-0 mb-6 ">
                      <AccordionTrigger className={` ${`item-${index}` === index && "underline"} `}>
                        <p className="underline-animation">{item.title}</p>
                      </AccordionTrigger>
                      <AccordionContent className="mt-4">
                        <div>
                          <p className='w-[30rem] secondaryTextColorGray mb-3'>{item.description}</p>
                          <Image src={item.image} alt="product showcase image" className='rounded-md lg:w-[47rem] lg:h-[26rem]' />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })
              }

            </Accordion>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ProductFeaturesShowcase