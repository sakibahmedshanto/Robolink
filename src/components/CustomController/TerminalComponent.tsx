import React from 'react';
import {
 View,
 Text,
 ScrollView,
} from 'react-native';
import { BaseWidget } from '../../types/widget';

export interface TerminalWidget extends BaseWidget {
  type: 'TERMINAL';
  label: string;
  lines: string[];
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  maxLines?: number;
  showCursor?: boolean;
}

const TerminalComponent: React.FC<{ 
 widget: TerminalWidget; 
 absoluteLeft: number; 
 absoluteTop: number;
}> = ({ widget, absoluteLeft, absoluteTop }) => {
 const {
   lines = [],
   backgroundColor = '#0d1117',
   textColor = '#c9d1d9',
   fontSize = 12,
   maxLines = 20,
   showCursor = true
 } = widget;

 const titleBarHeight = 28;
 const padding = 12;
 const lineHeight = fontSize * 1.4;
 const contentHeight = widget.height - titleBarHeight;
 const visibleLines = Math.min(lines.length, maxLines);
 const displayLines = lines.slice(-visibleLines);

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
     {/* Terminal Window Frame */}
     <View
       style={{
         width: '100%',
         height: '100%',
         backgroundColor: '#21262d',
         borderRadius: 8,
         borderWidth: 1,
         borderColor: '#30363d',
         shadowColor: '#000',
         shadowOffset: { width: 0, height: 4 },
         shadowOpacity: 0.4,
         shadowRadius: 8,
         elevation: 4,
       }}
     >
       {/* Title Bar */}
       <View
         style={{
           width: '100%',
           height: titleBarHeight,
           backgroundColor: '#21262d',
           borderTopLeftRadius: 8,
           borderTopRightRadius: 8,
           flexDirection: 'row',
           alignItems: 'center',
           paddingHorizontal: 16,
         }}
       >
         {/* Traffic Light Buttons */}
         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
           <View
             style={{
               width: 10,
               height: 10,
               borderRadius: 5,
               backgroundColor: '#ff5f57',
               marginRight: 8,
             }}
           />
           <View
             style={{
               width: 10,
               height: 10,
               borderRadius: 5,
               backgroundColor: '#ffbd2e',
               marginRight: 8,
             }}
           />
           <View
             style={{
               width: 10,
               height: 10,
               borderRadius: 5,
               backgroundColor: '#28ca42',
             }}
           />
         </View>

         {/* Title */}
         <View style={{ flex: 1, alignItems: 'center' }}>
           <Text
             style={{
               color: '#8b949e',
               fontSize: 11,
               fontWeight: '500',
             }}
           >
             Terminal
           </Text>
         </View>
       </View>

       {/* Terminal Screen */}
       <View
         style={{
           flex: 1,
           backgroundColor: backgroundColor,
           marginHorizontal: 2,
           marginBottom: 2,
           borderBottomLeftRadius: 6,
           borderBottomRightRadius: 6,
         }}
       >
         {/* Content Area Border */}
         <View
           style={{
             margin: 4,
             flex: 1,
             borderWidth: 0.5,
             borderColor: 'rgba(255, 255, 255, 0.1)',
             borderRadius: 3,
             position: 'relative',
           }}
         >
           {/* Scanlines Effect */}
           <View
             style={{
               position: 'absolute',
               top: 0,
               left: 0,
               right: 0,
               bottom: 0,
               opacity: 0.5,
             }}
           >
             {Array.from({ length: Math.floor(contentHeight / 2) }).map((_, index) => (
               <View
                 key={index}
                 style={{
                   height: 1,
                   backgroundColor: 'rgba(255, 255, 255, 0.02)',
                   marginBottom: 1,
                 }}
               />
             ))}
           </View>

           {/* Scrollable Content */}
           <ScrollView
             style={{
               flex: 1,
               padding: padding,
             }}
             showsVerticalScrollIndicator={false}
           >
             {displayLines.map((line, index) => {
               const isPromptLine = line.startsWith('$') || line.startsWith('>');
               
               return (
                 <View
                   key={index}
                   style={{
                     flexDirection: 'row',
                     alignItems: 'flex-start',
                     marginBottom: 2,
                   }}
                 >
                   <Text
                     style={{
                       color: isPromptLine ? '#7ee787' : textColor,
                       fontSize: fontSize,
                       fontFamily: 'Courier',
                       fontWeight: '400',
                       lineHeight: lineHeight,
                       textShadowColor: isPromptLine ? '#7ee787' : textColor,
                       textShadowOffset: { width: 0, height: 0 },
                       textShadowRadius: 0.5,
                       flex: 1,
                     }}
                   >
                     {line}
                   </Text>
                 </View>
               );
             })}

             {/* Cursor */}
             {showCursor && displayLines.length > 0 && (
               <View
                 style={{
                   flexDirection: 'row',
                   alignItems: 'flex-start',
                 }}
               >
                 <View
                   style={{
                     width: 8,
                     height: fontSize + 2,
                     backgroundColor: textColor,
                   }}
                 >
                   {/* Blinking animation would need additional library in React Native */}
                 </View>
               </View>
             )}
           </ScrollView>
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

export default TerminalComponent;