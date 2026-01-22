// // app/(tabs)/_layout.tsx
// import { Tabs } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";

// export default function TabsLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: "#8B5CF6",
//         tabBarStyle: {
//           backgroundColor: "#0F3A5F",
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: "Home",
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="home" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: "Profile",
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="person" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="diy-tales"
//         options={{
//           title: "DIY Tales",
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="create" size={size} color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }



// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Image } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, 
        tabBarStyle: {
          backgroundColor: "#0d5a9d",
        },
      }}
    >
       
      <Tabs.Screen
        name="profile"
        options={{
          // title: "Profile",
          tabBarIcon: ({ focused, size }) => (
            <Image
              source={require("@/assets/icons/profico.png")}
              style={{
                width: size,
                height: size, 
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Mytales",
          tabBarIcon: ({ focused, size }) => (
            <Image
              source={require("@/assets/icons/mytales.png")}
              style={{
                width: size,
                height: size, 
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="diy-tales"
        options={{
          // title: "DIY Tales",
          tabBarIcon: ({ focused, size }) => (
            <Image
              source={require("@/assets/icons/diytales.png")}
              style={{
                width: size,
                height: size, 
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}