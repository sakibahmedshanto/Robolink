import React from 'react';
import {
 View,
 Text,
} from 'react-native';
import { BaseWidget } from '../../types/widget';

export interface LCDWidget extends BaseWidget {
   type: 'LCD';
   label: string;
   text: string;
   backgroundColor?: string;
   textColor?: string;
   fontSize?: number;
   lines?: number;
}

const LCDComponent: React.FC<{ 
 widget: LCDWidget; 
 absoluteLeft: number; 
 absoluteTop: number;
}> = ({ widget, absoluteLeft, absoluteTop }) => {
 const {
   text = '',
   backgroundColor = '#1a1a1a',
   textColor = '#00ff41',
   fontSize = 14,
   lines = 1
 } = widget;

 const padding = 16;
 const textLines = text.split('\n').slice(0, lines);

 return (
   <View
     style={{
       position: 'absolute',
       left: absoluteLeft,
       top: absoluteTop,
       width: widget.width,
       height: widget.height,
     }}
   >
     {/* Outer LCD Frame */}
     <View
       style={{
         width: '100%',
         height: '100%',
         backgroundColor: '#2d2d2d',
         borderRadius: 8,
         borderWidth: 2,
         borderColor: '#444',
         shadowColor: '#000',
         shadowOffset: { width: 0, height: 2 },
         shadowOpacity: 0.4,
         shadowRadius: 4,
         elevation: 3,
       }}
     >
       {/* Inner Bezel */}
       <View
         style={{
           margin: 4,
           flex: 1,
           backgroundColor: '#333',
           borderRadius: 4,
           borderWidth: 1,
           borderColor: '#666',
         }}
       >
         {/* Screen Area */}
         <View
           style={{
             margin: 4,
             flex: 1,
             backgroundColor: backgroundColor,
             borderRadius: 2,
             borderWidth: 0.5,
             borderColor: textColor,
             opacity: 0.9,
             position: 'relative',
           }}
         >
           {/* Scanlines Overlay */}
           <View
             style={{
               position: 'absolute',
               top: 0,
               left: 0,
               right: 0,
               bottom: 0,
               opacity: 0.3,
             }}
           >
             {/* Simulated scanlines with multiple thin views */}
             {Array.from({ length: Math.floor(widget.height / 4) }).map((_, index) => (
               <View
                 key={index}
                 style={{
                   height: 2,
                   backgroundColor: 'rgba(255, 255, 255, 0.05)',
                   marginBottom: 2,
                 }}
               />
             ))}
           </View>

           {/* Text Content */}
           <View
             style={{
               padding: padding,
               flex: 1,
               justifyContent: lines > 1 ? 'flex-start' : 'center',
             }}
           >
             {textLines.map((line, index) => (
               <Text
                 key={index}
                 style={{
                   color: textColor,
                   fontSize: fontSize,
                   fontFamily: 'Courier',
                   fontWeight: '400',
                   lineHeight: fontSize * 1.4,
                   textShadowColor: textColor,
                   textShadowOffset: { width: 0, height: 0 },
                   textShadowRadius: 8,
                   marginBottom: index < textLines.length - 1 ? 2 : 0,
                 }}
               >
                 {line}
               </Text>
             ))}
           </View>

           {/* Screen Reflection */}
           <View
             style={{
               position: 'absolute',
               top: 0,
               left: 0,
               right: 0,
               height: (widget.height - 16) / 3,
               backgroundColor: 'rgba(255, 255, 255, 0.1)',
               borderRadius: 2,
               opacity: 0.6,
             }}
           />
         </View>
       </View>
     </View>

     {/* Optional Label */}
     {widget.label && (
       <View
         style={{
           position: 'absolute',
           top: -20,
           left: 0,
           right: 0,
         }}
       >
         <Text
           style={{
             fontSize: 10,
             color: '#666',
             fontWeight: '600',
             textTransform: 'uppercase',
             textAlign: 'center',
           }}
         >
           {widget.label}
         </Text>
       </View>
     )}
   </View>
 );
};

export default LCDComponent;
