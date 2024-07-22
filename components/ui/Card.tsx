import { View, ViewStyle, Text, TextStyle } from 'react-native';

interface CardProps extends React.PropsWithChildren {
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Card({ children, style = {} }: CardProps) {
  return (
    <View
      style={{
        padding: 15,
        borderRadius: 15,
        backgroundColor: "black",
        elevation: 8,
        shadowColor: "white",
        shadowRadius: 20,
        shadowOffset: { height: 10, width: 0 },
        shadowOpacity: 0.5,

        ...style,
      }}
    >
      {children}
    </View>
  );
}


// import React from 'react';
// import { View, ViewStyle, Text, TextStyle } from 'react-native';

// interface CardProps extends React.PropsWithChildren {
//   style?: ViewStyle;
//   textStyle?: TextStyle;
// }

// export default function Card({ children, style = {}, textStyle = {} }: CardProps) {
//   return (
//     <View
//       style={{
//         padding: 15,
//         borderRadius: 15,
//         backgroundColor: "black",
//         elevation: 8,
//         shadowColor: "white",
//         shadowRadius: 20,
//         shadowOffset: { height: 10, width: 0 },
//         shadowOpacity: 0.5,
//         ...style,
//       }}
//     >
//       <Text
//         style={{
//           color: "white",
//           ...textStyle,
          
//         }}
//       >
//         {children}
//       </Text>
//     </View>
//   );
// }
