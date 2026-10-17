import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { Flip } from 'gsap/Flip';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(useGSAP, SplitText, DrawSVGPlugin, Draggable, InertiaPlugin, Flip, MotionPathPlugin, CustomEase);

CustomEase.create('paper', '0.65, 0, 0.35, 1'); // page-level moves
CustomEase.create('settle', '0.22, 1, 0.36, 1'); // UI details
gsap.defaults({ ease: 'settle', duration: 0.5 });

export { gsap, useGSAP, SplitText, DrawSVGPlugin, Draggable, InertiaPlugin, Flip, MotionPathPlugin, CustomEase };
