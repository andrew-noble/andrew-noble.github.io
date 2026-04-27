Between February and March, 2026, I designed, built, and tested my first printed circuit board end-to-end. This board takes 24 V from two car batteries and does two things with it: (1) protects sensitive devices from reverse-polarity and transient, and (2) regulates the 24 V down to 12 V for a onboard computer and stepper motor.

I learned an huge amount, and want to record it for posterity. In the spirit of Derek Sivers, I've compressed everything into really tight [directives](https://sive.rs/2do), with expansions on each for rationale.

For CAD software I used KiCAD and this primarily concerns analog electronics. I'll circle back when I design something with digital logic.

# TL;DR, directives:

**Architecture**

1.  Make a load inventory.
2.  Manually test each load's specs.
3.  Size batteries per load inventory and the desired runtime.

**Schematic capture and part selection**

4.  Decompose circuit into required features and implement each as a sub-circuit.
5.  Verify footprint availability and part stock early; switch freely if necessary.
6.  Read the datasheet to verify symbol pinout against the physical part.
7.  Read the datasheet. For ICs, it tells you how to size peripheral passive components.

**Layout**

8.  Read the datasheet. It tells you how to lay out ICs per thermal considerations.
9.  For high-current paths, use copper pours rather than large traces.
10. Within a copper pour, use thermal reliefs for through-hole terminals and use solid fill for pad terminals.

**Fab checks**

11. Utilize the 3D-viewer in your CAD software to catch footprint mistakes.

**Fabrication**

12. Use solder paste for small ICs or bulk soldering (stencil or not). Otherwise, just use an iron and solder wire.
13. To remove solder with a wick, (1) use flux, (2) hold wick in tweezers in one hand, and (3) pin it down and lightly "scrub" it across pads with the iron in your other hand.
14. Keep your soldering iron tinned.
15. Make hot air fast enough to heat quickly, but not so fast that parts gets blown around.

**Testing**

16. Do continuity checks first.
17. Power up with increasing current limits and loads (no load → dummy resistor → lightest load → full load).
18. Hack around mistakes.

**General**

19. Don't renumber components.
20. Iterate.

# Notes

**1 — Inventory power loads**
It wasn't obvious to me how to start this process, as a non-EE. Eventually, I wound up making a simple list of the devices in my system. This worked well. Find the datasheet for each of your system's devices and track down the rated voltage and power draw for each. A quick and dirty excel sheet is ideal for this.

**2 — Test loads empirically**
This critical datasheet info can be hard to find or even outright incorrect (looking at you, Ouster), so it's worth manually testing the stated voltage ranges of the devices. For example, our LiDAR is rated to accept 12V - 24V but doesn't actually work reliably at 12V, and thus needs 24 V.

**4 — Break down by feature**
For my application, the PCB needed to regulate power for my devices and protect them from the potentially noisy car batteries I'm using. I determined my requirements were (1) reverse polarity protection, (2) bulk capacitance protection, (3) fuse protection, (4) regulation from 24 V down to 12 V. Each of these features can be broken down into sub-circuits, which enables to to do the next step: part selection and schematic capture. For example, look up how to make reverse polarity protection (mine used a P-type MOSFET), copy whatever circuit you find on google, check it against whatever EE knowledge you have and maybe [Falstad simulator](https://www.falstad.com/circuit/circuitjs.html), then size the required parts to your particular application and place them in the schematic.

**5 — Part availability**
For each symbol you place in a schematic, you should have a sense for the availability of the physical part _and_ its footprint CAD model. This is one of the mistakes I made. After completing the schematic capture, I began laying out the board. The switching regulator I selected from Texas Instruments did not have an available footprint file. I considered drawing my own footprint from the CAD in the datasheet, but since this 24V -> 12V regulator IC would be the crux of my board's thermal load, I knew a mistake here could ruin the entire effort. In the end, I decided to backtrack and change to an entirely different regulator that did have an available footprint from the manufacturer. This ended up being the right decision.

If a selected part doesn't have footprint EDA available or is out-of-stock, move on. Don't get attached, simply move on and pick a different part. There are a ton of part options out there.

**6 — Verify pin configuration**
This caused a board rev. For my P-type MOSFET in a SOT-223 (3-pin) package, I picked a schematic symbol that did not agree with the part's actual pinout, which caused the layout to be completely wrong. You can get a symbol for any source, gate, and drain configuration, which means there is a minefield of incorrect symbols you can pick. You must verify this against the datasheet to make sure you have it right. Check multiple times between (1) symbol, (2) footprint, (3) actual part datasheet. [Falstad simulator](https://www.falstad.com/circuit/circuitjs.html?ctz=DwYwlgTgBAZgvAIgIwKgFwM6IAwDpsEECsqYIiSeATAVQOx0DM2AHFQGwCcndqIARoiLZUAB0EJhqAG4QhqALaYhAUwC0SFAD4AUFCjAYUAB6IqLFlE1Uo5y+wAsqeAkaMZaCrhJR+KnPhUCAD0uvrAAO4mZha2rLaxds44IWEG0KYIdlbs2AmWNCzJCCJQcsiEIqF6BtLRyEg2hVaNVg5OsClQES6lCgCGxtKIzKk1kfXWUI62dDaOxVVpE5nZU2u5i2PhUZnr8esWW9U7k63ZF0edJdvp9Q6MTQ55DzaNRdel5ZQEtysj2Ac0yBr2Bx2WuxiBVioKSnz+kIQsOeUFhV16CPujys5lR2IW8JOBkRUxmUyQ7XBOmAwXAEF0QA) here helped me make absolutely sure I had my G, S, D straight.

**7— Lean on datasheet for passive sizing**
Look at any PCB schematic and the circuitry around an IC is incredibly intimidating. What are all those capacitors and resistors and inductors doing? Well, the datasheet tells you. They're enabling the IC to do its job. Don't fool yourself that this is something you should have in your brain. Read the datasheet.

**8 — Read the datasheet for layout**
For the buck regulator on my board, there are significant thermal considerations to make in the layout. Not to mention, its not clear how to make an elegant layout with the many-pin QFN package. Simply reading the TI datasheet left me with a great sample layout. Through this, I learned about thermal vias and power strap pours as an enclave in a GND pour too, which are quite elegant.

**11 — Use the 3D viewer**
Sometimes you might hastily pick a EDA library footprint for a component you find on Digikey. The 3D viewer can be a quick sanity check for this. It will be obvious when a 3D EDA model does not correspond with the product photos on digikey.

**12 — Solder paste vs iron**
Solder paste + hot air gun takes a while to heat up and also heats things indiscriminately. Use it for small IC pins (like the QFN package of my buck converter) or doing a ton of SMD components (with a stencil or not). Otherwise, just use the iron.

**18 — Hack around mistakes**
On my second rev, I used a small shunt (a short piece of wire) to short/bypass a mis-wired P-type MOSFET that was non-essential, allowing me to learn that the rest of the board worked beautifully. Even if there were additional faults, this technique would enable you to extract maximal learning from each board rev.

**19 — Don't change component numbering**
It causes annoying cascades into the BOM, making ordering more parts for revs annoying.

**20 — Iterate**
There is so much to consider, its faster to iterate and test quickly than stress about aligning everything in one shot.

# Reflections

## Revisions

Two revs on this board generated a few of the directives:

1. Wrong fuse holder footprints, wrong inductor footprint, bad buck converter layout. Follow directive 11, and generally just be more careful about footprints. I didn't even get to test this one, it was non-functional.
2. P-type MOSFET was misconfigured and screw terminals had wrong, but luckily-compatible footprint. Follow directives 6 and 11.

## Extra Learnings

I had a few false short confusions during testing: - With a PSU connected but not outputting power, you can erroneously read a short across the input terminals _through the PSU's internal path_. This confused me. - Using a DMM's continuity mode on circuits with large caps produces shorts momentarily while the capacitor charges up.
My EE friend Matt told me about a "battery junction box" approach. Whereas my board accepts battery power and regulates it centrally before distributing it, a BJB approach distributes raw voltage and has a regulator for each device. It's more efficient and robust because you're distributing higher voltage (like mains AC vs home DC) and no single point of failure, respectively. It costs you more PCBs and regulator chips. Common practice in EVs.

It was very surprising to me that most of my part selections and decisions were based on part availability rather than system requirements. I suspect this is because PCB changes are closer in spirit to software changes than they are to mechanical changes. Changing a motor in a mechanical system would have very disruptive cascading effects into other parts of the system. But even fairly dramatic PCB changes don't threaten to add a bunch of work.

It was surprising that most of the hurdles (and thus learning) were logistical and unrelated to electrical engineering. Component procurement, interpreting datasheets, understanding footprints/packages, EDA file availability were all bigger hurdles than understanding the electrical principles.

## LLMs in Electronics Design

- AI wasted a ton of my time with component selection/search. It will send you in circles. Get your specs and do a traditional search through Digikey or Texas Instruments' site.
- LLMs are good at checking your EE instincts. Just remain skeptical.
- LLMs are good at arcane electronics knowledge like what packages or parts are older and more supported and likely to have EDA available. Or why a certain package is more thermal tolerant, for example.

## Summary

Making a PCB is an exercise in many-dimensional constraint alignment. For dozens of parts, you must verify that the selected parts:

- have the correct primary specifications (like resistance for a resistor)
- have the correct secondary specifications (like power rating for a resistor)
- have an appropriate symbol on the schematic
- have the correct footprints (either in KiCAD library or available online from mfg)
  - prereq: the footprint is available or you're willing to make it from scratch
- are in-stock from the vendor
- are laid out correctly (PTH parts having thermal reliefs, for example)
- are manageable to fabricate with the equipment that is available to you (ball grid array packages are near impossible to hand-solder, for example)

If you have 20 parts, that's is 200 different considerations that must be aligned. My understanding is that for experienced EE's the common parts like commodity resistors and capacitors fade into unconscious and you begin to just do these alignments for the non-routine, application-specific parts of your circuit.

It's better to align all of these considerations for each part at a single time, otherwise you'll probably forget about one of them and have to do rework. I think a checklist might be useful here.

## Media

<figure>
<img src="/assets/pcb-schematic.png" alt="PCB schematic" />
<figcaption>Schematic capture in KiCAD, showing sub-circuits from directive #4</figcaption>
</figure>

<figure>
<img src="/assets/pcb.png" alt="PCB layout" />
<figcaption>Board layout in KiCAD</figcaption>
</figure>

<figure>
<img src="/assets/pcb-done.jpeg" alt="Completed PCB" />
<figcaption>Completed and tested board</figcaption>
</figure>

<figure>
<iframe width="315" height="560" src="https://www.youtube.com/embed/er9gKZjxFXE" title="Heat gun soldering" frameborder="0" allowfullscreen></iframe>
<figcaption>Heat gun soldering a few SMD capacitors</figcaption>
</figure>

<figure>
<iframe width="315" height="560" src="https://www.youtube.com/embed/9UgSQ3jcM8I" title="Solder paste spread" frameborder="0" allowfullscreen></iframe>
<figcaption>How to apply solder paste by hand to SMD pads</figcaption>
</figure>
