// 'use client'

// import { useEffect, useState } from 'react'
// import { getCurrentUser } from '@/lib/auth'
// import { predefinedRestrictedZones } from '@/components/predefinedRestrictedZones'

// import {
//   AlertTriangle,
//   Bell,
//   CheckCircle2,
//   Circle,
//   Clock3,
//   LayoutDashboard,
//   MapPin,
//   Menu,
//   Shield,
//   Siren,
//   Users,
//   X,
// } from 'lucide-react'
// import { userAlerts } from '@/hooks/userAlerts'
// import Link from 'next/link'
// import dynamic from 'next/dynamic'
// import { AnimatePresence, motion } from 'framer-motion'

// /* ========================================================================= */
// /* MAP COMPONENTS */
// /* ========================================================================= */

// const CampusAlertMap = dynamic(
//   () => import('@/components/campus-alert-map'),
//   {
//     ssr: false,
//   }
// )

// const RestrictedZoneMap = dynamic(
//   () => import('@/components/restricted-zone-map'),
//   {
//     ssr: false,
//   }
// )

// /* ========================================================================= */
// /* TEMPORARY MOCK API */
// /* ========================================================================= */
// /*
//   This currently behaves like your backend API.

//   Later replace this function with something like:

//   async function fetchAlerts() {
//     const token = getToken()

//     const res = await fetch(
//       'http://localhost:8000/api/alerts',
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     )

//     if (!res.ok) {
//       throw new Error('Failed to fetch alerts')
//     }

//     return res.json()
//   }
// */

// // async function fetchAlerts() {
// //   return [
// //     {
// //       id: 1,
// //       title: 'Perimeter Breach',
// //       location: 'North Gate',
// //       latitude: 12.9711,
// //       longitude: 79.1641,
// //       severity: 'High',
// //       time: '2 min ago',
// //       status: 'Active',
// //       snapshot: '/snapshots/perimeter-breach.jpeg',
// //     },

// //     {
// //       id: 2,
// //       title: 'Crowd Detected',
// //       location: 'Central Lawn',
// //       latitude: 12.9698,
// //       longitude: 79.1578,
// //       severity: 'Medium',
// //       time: '8 min ago',
// //       status: 'Resolved',
// //       snapshot: '/snapshots/crowd-detected.jpeg',
// //     },

// //     {
// //       id: 3,
// //       title: 'Vehicle in Restricted Zone',
// //       location: 'Library Road',
// //       latitude: 12.9706,
// //       longitude: 79.1600,
// //       severity: 'Low',
// //       time: '14 min ago',
// //       status: 'Investigating',
// //       snapshot: '/snapshots/restricted-vehicle.jpeg',
// //     },
// //   ]
// // }

// const { alerts, acknowledgeAlert } = userAlerts()

// /* ========================================================================= */
// /* ANIMATION VARIANTS */
// /* ========================================================================= */

// const pageVariants = {
//   hidden: {
//     opacity: 0,
//   },

//   visible: {
//     opacity: 1,
//     transition: {
//       duration: 0.45,
//       ease: 'easeOut',
//     },
//   },
// }

// const fadeUp = {
//   hidden: {
//     opacity: 0,
//     y: 18,
//   },

//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.45,
//       ease: 'easeOut',
//     },
//   },
// }

// const cardContainer = {
//   hidden: {},

//   visible: {
//     transition: {
//       staggerChildren: 0.08,
//     },
//   },
// }

// const cardItem = {
//   hidden: {
//     opacity: 0,
//     y: 20,
//     scale: 0.98,
//   },

//   visible: {
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: {
//       duration: 0.4,
//       ease: 'easeOut',
//     },
//   },
// }

// const listContainer = {
//   hidden: {},

//   visible: {
//     transition: {
//       staggerChildren: 0.08,
//     },
//   },
// }

// const listItem = {
//   hidden: {
//     opacity: 0,
//     x: 12,
//   },

//   visible: {
//     opacity: 1,
//     x: 0,
//     transition: {
//       duration: 0.35,
//       ease: 'easeOut',
//     },
//   },

//   exit: {
//     opacity: 0,
//     x: 30,
//     height: 0,
//     marginTop: 0,
//     marginBottom: 0,
//     paddingTop: 0,
//     paddingBottom: 0,
//     transition: {
//       duration: 0.25,
//       ease: 'easeInOut',
//     },
//   },
// }

// /* ========================================================================= */
// /* GREETING */
// /* ========================================================================= */

// function getGreeting() {
//   const hour = new Date().getHours()

//   if (hour >= 5 && hour < 12) {
//     return 'Good morning'
//   }

//   if (hour >= 12 && hour < 17) {
//     return 'Good afternoon'
//   }

//   if (hour >= 17 && hour < 21) {
//     return 'Good evening'
//   }

//   return 'Good night'
// }

// /* ========================================================================= */
// /* SEVERITY */
// /* ========================================================================= */

// function severityClass(severity) {
//   if (severity === 'High') {
//     return 'bg-red-500/10 text-red-600'
//   }

//   if (severity === 'Medium') {
//     return 'bg-yellow-500/10 text-yellow-600'
//   }

//   return 'bg-blue-500/10 text-blue-600'
// }

// function severityDotClass(severity) {
//   if (severity === 'High') {
//     return 'bg-red-500'
//   }

//   if (severity === 'Medium') {
//     return 'bg-yellow-500'
//   }

//   return 'bg-blue-500'
// }

// /* ========================================================================= */
// /* DASHBOARD */
// /* ========================================================================= */

// export default function SecurityDashboard() {
//   const [mobileMenu, setMobileMenu] = useState(false)

//   const [restrictedZoneCount, setRestrictedZoneCount] = useState(0)

//   const [alertList, setAlertList] = useState([])

//   const [currentUser, setCurrentUser] = useState(null)

//   const [loadingAlerts, setLoadingAlerts] = useState(true)

//   /* ----------------------------------------------------------------------- */
//   /* LOAD USER + ALERTS + RESTRICTED ZONES */
//   /* ----------------------------------------------------------------------- */

//   useEffect(() => {
//     const user = getCurrentUser()

//     setCurrentUser(user)

//     const savedZones = localStorage.getItem(
//       'nmsight-restricted-zones'
//     )

//     let userZones = []

//     if (savedZones) {
//       try {
//         userZones = JSON.parse(savedZones)
//       } catch (error) {
//         console.error(
//           'Could not load restricted zones',
//           error
//         )
//       }
//     }

//     setRestrictedZoneCount(
//       predefinedRestrictedZones.length +
//         userZones.length
//     )

//     async function loadAlerts() {
//       try {
//         const data = await fetchAlerts()

//         setAlertList(data)
//       } catch (error) {
//         console.error(
//           'Failed to load alerts:',
//           error
//         )
//       } finally {
//         setLoadingAlerts(false)
//       }
//     }

//     loadAlerts()
//   }, [])

//   /* ----------------------------------------------------------------------- */
//   /* ACKNOWLEDGE ALERT */
//   /* ----------------------------------------------------------------------- */

//   function acknowledgeAlert(id) {
//     setAlertList((current) =>
//       current.filter((alert) => alert.id !== id)
//     )
//   }

//   /* ----------------------------------------------------------------------- */
//   /* STATISTICS */
//   /* ----------------------------------------------------------------------- */

//   const activeAlertCount = alertList.filter(
//     (alert) => alert.status === 'Active'
//   ).length

//   const highPriorityCount = alertList.filter(
//     (alert) => alert.severity === 'High'
//   ).length

//   /* ----------------------------------------------------------------------- */
//   /* USER INITIAL */
//   /* ----------------------------------------------------------------------- */

//   const userInitial = currentUser?.name
//     ? currentUser.name.charAt(0).toUpperCase()
//     : 'S'

//   /* ----------------------------------------------------------------------- */
//   /* UI */
//   /* ----------------------------------------------------------------------- */

//   return (
//     <motion.div
//       className="min-h-screen bg-muted/30 text-foreground"
//       variants={pageVariants}
//       initial="hidden"
//       animate="visible"
//     >
//       {/* ================================================================= */}
//       {/* MOBILE OVERLAY */}
//       {/* ================================================================= */}

//       <AnimatePresence>
//         {mobileMenu && (
//           <motion.div
//             className="fixed inset-0 z-40 bg-black/40 lg:hidden"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={() => setMobileMenu(false)}
//           />
//         )}
//       </AnimatePresence>

//       {/* ================================================================= */}
//       {/* SIDEBAR */}
//       {/* ================================================================= */}

//       <aside
//         className={`fixed inset-y-0 left-0 z-50 w-64 border-r bg-card transition-transform duration-200 ${
//           mobileMenu
//             ? 'translate-x-0'
//             : '-translate-x-full'
//         } lg:translate-x-0`}
//       >
//         <div className="flex h-full flex-col">

//           {/* Logo */}

//           <motion.div
//             className="flex h-20 items-center gap-3 border-b px-6"
//             initial={{ opacity: 0, x: -15 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.4 }}
//           >
//             <motion.div
//               className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"
//               whileHover={{
//                 scale: 1.05,
//                 rotate: 2,
//               }}
//               transition={{
//                 type: 'spring',
//                 stiffness: 300,
//               }}
//             >
//               <Shield className="size-5" />
//             </motion.div>

//             <div>
//               <h1 className="font-bold">
//                 NMSight
//               </h1>

//               <p className="text-xs text-muted-foreground">
//                 Security Operations
//               </p>
//             </div>

//             <button
//               className="ml-auto lg:hidden"
//               onClick={() => setMobileMenu(false)}
//             >
//               <X className="size-5" />
//             </button>
//           </motion.div>

//           {/* Navigation */}

//           <nav className="flex-1 space-y-1 p-4">

//             <SidebarLink
//               href="/security/dashboard"
//               icon={
//                 <LayoutDashboard className="size-4" />
//               }
//               label="Dashboard"
//               active
//             />

//             <SidebarLink
//               href="/security/alerts"
//               icon={<Bell className="size-4" />}
//               label="Alerts"
//               badge={alertList.length}
//             />

//             <SidebarLink
//               href="/security/campus-zones"
//               icon={<MapPin className="size-4" />}
//               label="Campus Zones"
//             />

//           </nav>

//           {/* System status */}

//           <div className="px-4 pb-3">
//             <div className="rounded-xl border bg-muted/40 p-3">

//               <div className="flex items-center gap-2">

//                 <motion.span
//                   className="size-2 rounded-full bg-green-500"
//                   animate={{
//                     opacity: [1, 0.45, 1],
//                     scale: [1, 1.15, 1],
//                   }}
//                   transition={{
//                     duration: 2,
//                     repeat: Infinity,
//                     ease: 'easeInOut',
//                   }}
//                 />

//                 <span className="text-xs font-medium">
//                   System Operational
//                 </span>

//               </div>

//               <p className="mt-1 text-[11px] text-muted-foreground">
//                 Campus monitoring active
//               </p>

//             </div>
//           </div>

//           {/* Logged in user */}

//           <motion.div
//             className="border-t p-4"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{
//               delay: 0.3,
//               duration: 0.4,
//             }}
//           >
//             <div className="flex items-center gap-3 rounded-xl bg-muted/60 p-3">

//               <motion.div
//                 className="flex size-9 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary"
//                 whileHover={{ scale: 1.08 }}
//               >
//                 {userInitial}
//               </motion.div>

//               <div className="min-w-0">

//                 <p className="truncate text-sm font-medium">
//                   {currentUser?.name ||
//                     'Security Officer'}
//                 </p>

//                 <p className="truncate text-xs text-muted-foreground">
//                   {currentUser?.email ||
//                     'security@nmsight.com'}
//                 </p>

//               </div>

//             </div>
//           </motion.div>

//         </div>
//       </aside>

//       {/* ================================================================= */}
//       {/* MAIN CONTENT */}
//       {/* ================================================================= */}

//       <main className="lg:pl-64">

//         {/* ================================================================= */}
//         {/* TOP BAR */}
//         {/* ================================================================= */}

//         <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">

//           <div className="flex items-center gap-3">

//             <button
//               className="rounded-lg p-2 transition-colors hover:bg-muted lg:hidden"
//               onClick={() => setMobileMenu(true)}
//             >
//               <Menu className="size-5" />
//             </button>

//             <div>

//               <h2 className="font-semibold">
//                 Security Dashboard
//               </h2>

//               <p className="text-xs text-muted-foreground sm:text-sm">
//                 Campus safety monitoring
//               </p>

//             </div>

//           </div>

//           {/* Notification */}

//           <motion.button
//             className="relative rounded-xl border bg-card p-2.5 hover:bg-muted"
//             whileHover={{
//               scale: 1.05,
//             }}
//             whileTap={{
//               scale: 0.95,
//             }}
//           >
//             <Bell className="size-5" />

//             {alertList.length > 0 && (
//               <motion.span
//                 className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] text-white"
//                 initial={{
//                   scale: 0,
//                 }}
//                 animate={{
//                   scale: 1,
//                 }}
//                 transition={{
//                   type: 'spring',
//                   stiffness: 400,
//                 }}
//               >
//                 {alertList.length}
//               </motion.span>
//             )}

//           </motion.button>

//         </header>

//         {/* ================================================================= */}
//         {/* PAGE */}
//         {/* ================================================================= */}

//         <div className="p-4 sm:p-6">

//           {/* ================================================================= */}
//           {/* WELCOME */}
//           {/* ================================================================= */}

//           <motion.div
//             className="mb-6"
//             variants={fadeUp}
//           >
//             <p className="text-xs font-semibold tracking-wider text-primary">
//               LIVE OPERATIONS
//             </p>

//             <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
//               {getGreeting()},{' '}
//               {currentUser?.name ||
//                 'Security Officer'}
//             </h1>

//             <p className="mt-1 text-sm text-muted-foreground">
//               Here's the current safety status across campus.
//             </p>
//           </motion.div>

//           {/* ================================================================= */}
//           {/* STATISTICS */}
//           {/* ================================================================= */}

//           <motion.div
//             className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
//             variants={cardContainer}
//             initial="hidden"
//             animate="visible"
//           >

//             <AnimatedStatCard
//               icon={
//                 <AlertTriangle className="size-5" />
//               }
//               label="Active Alerts"
//               value={activeAlertCount}
//               description="Currently requiring attention"
//             />

//             <AnimatedStatCard
//               icon={<Siren className="size-5" />}
//               label="High Priority"
//               value={highPriorityCount}
//               description="Requires immediate response"
//             />

//             <AnimatedStatCard
//               icon={<Users className="size-5" />}
//               label="People Detected"
//               value="17"
//               description="Across monitored zones"
//             />

//             <AnimatedStatCard
//               icon={<MapPin className="size-5" />}
//               label="Restricted Areas"
//               value={restrictedZoneCount}
//               description="Protected campus zones"
//             />

//           </motion.div>

//           {/* ================================================================= */}
//           {/* MAP + ALERTS */}
//           {/* ================================================================= */}

//           <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">

//             {/* ================================================================= */}
//             {/* CAMPUS MAP */}
//             {/* ================================================================= */}

//             <motion.section
//               className="overflow-hidden rounded-2xl border bg-card shadow-sm"
//               variants={fadeUp}
//               initial="hidden"
//               animate="visible"
//               whileHover={{
//                 y: -2,
//                 transition: {
//                   duration: 0.2,
//                 },
//               }}
//             >

//               <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">

//                 <div>

//                   <div className="flex items-center gap-2">

//                     <h2 className="font-semibold">
//                       VIT Vellore Campus
//                     </h2>

//                     <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
//                       AI MONITORING
//                     </span>

//                   </div>

//                   <p className="text-sm text-muted-foreground">
//                     Security alerts and incident locations
//                   </p>

//                 </div>

//                 <div className="flex items-center gap-2">

//                   <motion.span
//                     className="size-2 rounded-full bg-green-500"
//                     animate={{
//                       opacity: [1, 0.4, 1],
//                       scale: [1, 1.15, 1],
//                     }}
//                     transition={{
//                       duration: 2,
//                       repeat: Infinity,
//                       ease: 'easeInOut',
//                     }}
//                   />

//                   <span className="text-xs font-medium text-green-600">
//                     Monitoring Active
//                   </span>

//                 </div>

//               </div>

//               <div className="p-5">

//                 <CampusAlertMap
//                   alerts={alertList}
//                 />

//               </div>

//             </motion.section>

//             {/* ================================================================= */}
//             {/* ACTIVE ALERTS */}
//             {/* ================================================================= */}

//             <motion.section
//               className="overflow-hidden rounded-2xl border bg-card shadow-sm"
//               variants={fadeUp}
//               initial="hidden"
//               animate="visible"
//               transition={{
//                 delay: 0.15,
//               }}
//             >

//               <div className="flex items-center justify-between border-b p-5">

//                 <div>

//                   <h2 className="font-semibold">
//                     Active Alerts
//                   </h2>

//                   <p className="text-sm text-muted-foreground">
//                     Security attention required
//                   </p>

//                 </div>

//                 <motion.span
//                   key={activeAlertCount}
//                   className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-600"
//                   initial={{
//                     scale: 0.8,
//                   }}
//                   animate={{
//                     scale: 1,
//                   }}
//                 >
//                   {activeAlertCount} active
//                 </motion.span>

//               </div>

//               <motion.div
//                 className="divide-y"
//                 variants={listContainer}
//                 initial="hidden"
//                 animate="visible"
//               >

//                 {loadingAlerts ? (

//                   <div className="p-10 text-center">

//                     <motion.div
//                       className="mx-auto size-5 rounded-full border-2 border-primary border-t-transparent"
//                       animate={{
//                         rotate: 360,
//                       }}
//                       transition={{
//                         duration: 0.8,
//                         repeat: Infinity,
//                         ease: 'linear',
//                       }}
//                     />

//                     <p className="mt-3 text-sm text-muted-foreground">
//                       Loading security alerts...
//                     </p>

//                   </div>

//                 ) : alertList.length === 0 ? (

//                   <motion.div
//                     className="flex flex-col items-center justify-center p-12 text-center"
//                     initial={{
//                       opacity: 0,
//                       scale: 0.95,
//                     }}
//                     animate={{
//                       opacity: 1,
//                       scale: 1,
//                     }}
//                   >

//                     <CheckCircle2 className="size-10 text-green-500" />

//                     <p className="mt-3 font-medium">
//                       Campus is clear
//                     </p>

//                     <p className="mt-1 text-sm text-muted-foreground">
//                       No active alerts at the moment.
//                     </p>

//                   </motion.div>

//                 ) : (

//                   <AnimatePresence mode="popLayout">

//                     {alertList.map((alert) => (

//                       <motion.div
//                         key={alert.id}
//                         layout
//                         variants={listItem}
//                         initial="hidden"
//                         animate="visible"
//                         exit="exit"
//                         className="p-4"
//                       >

//                         <div className="flex gap-3">

//                           {/* Severity */}

//                           <div className="mt-1.5">

//                             {alert.severity === 'High' ? (

//                               <motion.span
//                                 className={`block size-2.5 rounded-full ${severityDotClass(
//                                   alert.severity
//                                 )}`}
//                                 animate={{
//                                   opacity: [
//                                     1,
//                                     0.45,
//                                     1,
//                                   ],
//                                   scale: [
//                                     1,
//                                     1.2,
//                                     1,
//                                   ],
//                                 }}
//                                 transition={{
//                                   duration: 1.6,
//                                   repeat: Infinity,
//                                   ease: 'easeInOut',
//                                 }}
//                               />

//                             ) : (

//                               <span
//                                 className={`block size-2.5 rounded-full ${severityDotClass(
//                                   alert.severity
//                                 )}`}
//                               />

//                             )}

//                           </div>

//                           <div className="min-w-0 flex-1">

//                             <div className="flex items-start justify-between gap-2">

//                               <div>

//                                 <p className="text-sm font-semibold">
//                                   {alert.title}
//                                 </p>

//                                 <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">

//                                   <MapPin className="size-3" />

//                                   {alert.location}

//                                 </p>

//                               </div>

//                               <span className="whitespace-nowrap text-xs text-muted-foreground">
//                                 {alert.time}
//                               </span>

//                             </div>

//                             <div className="mt-3 flex items-center justify-between">

//                               <span
//                                 className={`rounded-full px-2 py-1 text-[10px] font-semibold ${severityClass(
//                                   alert.severity
//                                 )}`}
//                               >
//                                 {alert.severity}
//                               </span>

//                               {alert.status === 'Active' && (

//                                 <motion.button
//                                   onClick={() =>
//                                     acknowledgeAlert(
//                                       alert.id
//                                     )
//                                   }
//                                   className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted"
//                                   whileHover={{
//                                     scale: 1.03,
//                                   }}
//                                   whileTap={{
//                                     scale: 0.97,
//                                   }}
//                                 >
//                                   Acknowledge
//                                 </motion.button>

//                               )}

//                             </div>

//                           </div>

//                         </div>

//                       </motion.div>

//                     ))}

//                   </AnimatePresence>

//                 )}

//               </motion.div>

//             </motion.section>

//           </div>

//           {/* ================================================================= */}
//           {/* RECENT SECURITY ACTIVITY */}
//           {/* ================================================================= */}

//           <motion.section
//             className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-sm"
//             variants={fadeUp}
//             initial="hidden"
//             animate="visible"
//             transition={{
//               delay: 0.3,
//             }}
//           >

//             <div className="border-b p-5">

//               <div className="flex items-center justify-between">

//                 <div>

//                   <h2 className="font-semibold">
//                     Recent Security Activity
//                   </h2>

//                   <p className="text-sm text-muted-foreground">
//                     Latest events detected by NMSight
//                   </p>

//                 </div>

//                 <div className="hidden items-center gap-2 sm:flex">

//                   <span className="size-2 rounded-full bg-primary" />

//                   <span className="text-xs text-muted-foreground">
//                     Live activity
//                   </span>

//                 </div>

//               </div>

//             </div>

//             <motion.div
//               className="divide-y"
//               variants={listContainer}
//               initial="hidden"
//               animate="visible"
//             >

//               {loadingAlerts ? (

//                 <div className="p-8 text-center">

//                   <p className="text-sm text-muted-foreground">
//                     Loading recent activity...
//                   </p>

//                 </div>

//               ) : alertList.length === 0 ? (

//                 <div className="p-8 text-center">

//                   <p className="text-sm text-muted-foreground">
//                     No recent security activity.
//                   </p>

//                 </div>

//               ) : (

//                 alertList.map((alert) => (

//                   <motion.div
//                     key={`activity-${alert.id}`}
//                     variants={listItem}
//                     whileHover={{
//                       backgroundColor:
//                         'rgba(255,255,255,0.02)',
//                     }}
//                   >

//                     <Activity
//                       icon={
//                         alert.severity === 'High'
//                           ? (
//                             <AlertTriangle className="size-4" />
//                           )
//                           : alert.title
//                               .toLowerCase()
//                               .includes('crowd')
//                           ? (
//                             <Users className="size-4" />
//                           )
//                           : (
//                             <MapPin className="size-4" />
//                           )
//                       }
//                       title={alert.title}
//                       location={alert.location}
//                       time={alert.time}
//                       status={
//                         alert.status || 'Active'
//                       }
//                     />

//                   </motion.div>

//                 ))

//               )}

//             </motion.div>

//           </motion.section>

//         </div>

//       </main>

//     </motion.div>
//   )
// }

// /* ========================================================================= */
// /* SIDEBAR LINK */
// /* ========================================================================= */

// function SidebarLink({
//   href,
//   icon,
//   label,
//   active = false,
//   badge,
// }) {
//   return (
//     <Link href={href}>

//       <motion.div
//         className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
//           active
//             ? 'bg-primary/10 font-medium text-primary'
//             : 'text-muted-foreground hover:bg-muted hover:text-foreground'
//         }`}
//         whileHover={{
//           x: 3,
//         }}
//         whileTap={{
//           scale: 0.98,
//         }}
//         transition={{
//           duration: 0.15,
//         }}
//       >

//         {icon}

//         <span className="flex-1">
//           {label}
//         </span>

//         {badge !== undefined && (
//           <motion.span
//             key={badge}
//             className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-600"
//             initial={{
//               scale: 0.8,
//               opacity: 0,
//             }}
//             animate={{
//               scale: 1,
//               opacity: 1,
//             }}
//           >
//             {badge}
//           </motion.span>
//         )}

//       </motion.div>

//     </Link>
//   )
// }

// /* ========================================================================= */
// /* STAT CARD */
// /* ========================================================================= */

// function AnimatedStatCard({
//   icon,
//   label,
//   value,
//   description,
// }) {
//   return (
//     <motion.div
//       className="rounded-2xl border bg-card p-5 shadow-sm"
//       variants={cardItem}
//       whileHover={{
//         y: -4,
//         scale: 1.01,
//         transition: {
//           duration: 0.2,
//         },
//       }}
//       whileTap={{
//         scale: 0.99,
//       }}
//     >

//       <div className="flex items-center justify-between">

//         <motion.div
//           className="rounded-xl bg-primary/10 p-2.5 text-primary"
//           whileHover={{
//             scale: 1.08,
//             rotate: 2,
//           }}
//           transition={{
//             type: 'spring',
//             stiffness: 300,
//           }}
//         >
//           {icon}
//         </motion.div>

//         <span className="flex items-center gap-1 text-xs font-medium text-green-600">

//           <motion.span
//             className="size-2 rounded-full bg-green-500"
//             animate={{
//               opacity: [1, 0.45, 1],
//             }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//             }}
//           />

//           Live

//         </span>

//       </div>

//       <p className="mt-4 text-sm text-muted-foreground">
//         {label}
//       </p>

//       <motion.p
//         key={value}
//         className="mt-1 text-2xl font-bold"
//         initial={{
//           opacity: 0,
//           y: 5,
//         }}
//         animate={{
//           opacity: 1,
//           y: 0,
//         }}
//         transition={{
//           duration: 0.25,
//         }}
//       >
//         {value}
//       </motion.p>

//       <p className="mt-1 text-xs text-muted-foreground">
//         {description}
//       </p>

//     </motion.div>
//   )
// }

// /* ========================================================================= */
// /* ACTIVITY */
// /* ========================================================================= */

// function Activity({
//   icon,
//   title,
//   location,
//   time,
//   status,
// }) {
//   return (
//     <div className="flex items-center gap-4 p-4">

//       <motion.div
//         className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
//         whileHover={{
//           scale: 1.08,
//         }}
//       >
//         {icon}
//       </motion.div>

//       <div className="min-w-0 flex-1">

//         <p className="truncate text-sm font-medium">
//           {title}
//         </p>

//         <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">

//           <MapPin className="size-3" />

//           {location}

//         </p>

//       </div>

//       <div className="hidden text-right sm:block">

//         <p className="flex items-center justify-end gap-1 text-xs text-muted-foreground">

//           <Clock3 className="size-3" />

//           {time}

//         </p>

//         <p
//           className={`mt-1 text-xs font-medium ${
//             status === 'Active'
//               ? 'text-red-600'
//               : status === 'Resolved'
//               ? 'text-green-600'
//               : status === 'Investigating'
//               ? 'text-yellow-600'
//               : 'text-muted-foreground'
//           }`}
//         >
//           {status}
//         </p>

//       </div>

//     </div>
//   )
// }


'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/auth'
import { predefinedRestrictedZones } from '@/components/predefinedRestrictedZones'

import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  MapPin,
  Menu,
  Shield,
  Siren,
  Users,
  X,
} from 'lucide-react'

import { userAlerts } from '@/hooks/userAlerts'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'

/* ========================================================================= */
/* MAP COMPONENTS */
/* ========================================================================= */

const CampusAlertMap = dynamic(
  () => import('@/components/campus-alert-map'),
  {
    ssr: false,
  }
)

const RestrictedZoneMap = dynamic(
  () => import('@/components/restricted-zone-map'),
  {
    ssr: false,
  }
)

/* ========================================================================= */
/* ANIMATION VARIANTS */
/* ========================================================================= */

const pageVariants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
    },
  },
}

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 18,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
    },
  },
}

const cardContainer = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const cardItem = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
}

const listContainer = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const listItem = {
  hidden: {
    opacity: 0,
    x: 12,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
    },
  },

  exit: {
    opacity: 0,
    x: 30,
    height: 0,
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
    transition: {
      duration: 0.25,
      ease: 'easeInOut',
    },
  },
}

/* ========================================================================= */
/* GREETING */
/* ========================================================================= */

function getGreeting() {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) {
    return 'Good morning'
  }

  if (hour >= 12 && hour < 17) {
    return 'Good afternoon'
  }

  if (hour >= 17 && hour < 21) {
    return 'Good evening'
  }

  return 'Good night'
}

/* ========================================================================= */
/* SEVERITY */
/* ========================================================================= */

function normalizeSeverity(severity) {
  if (!severity) return 'Low'

  const value = String(severity).toUpperCase()

  if (value === 'CRITICAL') return 'Critical'
  if (value === 'HIGH') return 'High'
  if (value === 'MEDIUM') return 'Medium'
  if (value === 'LOW') return 'Low'

  return severity
}

function severityClass(severity) {
  const normalized = normalizeSeverity(severity)

  if (normalized === 'Critical') {
    return 'bg-red-500/10 text-red-700'
  }

  if (normalized === 'High') {
    return 'bg-red-500/10 text-red-600'
  }

  if (normalized === 'Medium') {
    return 'bg-yellow-500/10 text-yellow-600'
  }

  return 'bg-blue-500/10 text-blue-600'
}

function severityDotClass(severity) {
  const normalized = normalizeSeverity(severity)

  if (
    normalized === 'Critical' ||
    normalized === 'High'
  ) {
    return 'bg-red-500'
  }

  if (normalized === 'Medium') {
    return 'bg-yellow-500'
  }

  return 'bg-blue-500'
}

/* ========================================================================= */
/* DASHBOARD */
/* ========================================================================= */

export default function SecurityDashboard() {
  const [mobileMenu, setMobileMenu] = useState(false)

  const [restrictedZoneCount, setRestrictedZoneCount] =
    useState(0)

  const [currentUser, setCurrentUser] = useState(null)

  /*
   * ALERTS COME FROM:
   *
   * /alerts/recent
   *
   * AND
   *
   * /ws/alerts
   *
   * through the userAlerts hook.
   */

  const {
    alerts,
    acknowledgeAlert,
    loading,
  } = userAlerts()

  /* ----------------------------------------------------------------------- */
  /* LOAD USER + RESTRICTED ZONES */
  /* ----------------------------------------------------------------------- */

  useEffect(() => {
    const user = getCurrentUser()

    setCurrentUser(user)

    const savedZones = localStorage.getItem(
      'nmsight-restricted-zones'
    )

    let userZones = []

    if (savedZones) {
      try {
        userZones = JSON.parse(savedZones)
      } catch (error) {
        console.error(
          'Could not load restricted zones',
          error
        )
      }
    }

    setRestrictedZoneCount(
      predefinedRestrictedZones.length +
        userZones.length
    )
  }, [])

  /* ----------------------------------------------------------------------- */
  /* STATISTICS */
  /* ----------------------------------------------------------------------- */

  const activeAlerts = alerts.filter(
    (alert) =>
      !alert.status ||
      alert.status === 'Active'
  )

  const activeAlertCount = activeAlerts.length

  const highPriorityCount = alerts.filter((alert) => {
    const severity = normalizeSeverity(alert.severity)

    return (
      severity === 'High' ||
      severity === 'Critical'
    )
  }).length

  /*
   * This is intentionally NOT hardcoded.
   *
   * Once your backend exposes people detection count,
   * connect it here.
   */

  const peopleDetected = 0

  /* ----------------------------------------------------------------------- */
  /* USER INITIAL */
  /* ----------------------------------------------------------------------- */

  const userInitial = currentUser?.name
    ? currentUser.name.charAt(0).toUpperCase()
    : 'S'

  /* ----------------------------------------------------------------------- */
  /* UI */
  /* ----------------------------------------------------------------------- */

  return (
    <motion.div
      className="min-h-screen bg-muted/30 text-foreground"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ================================================================= */}
      {/* MOBILE OVERLAY */}
      {/* ================================================================= */}

      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenu(false)}
          />
        )}
      </AnimatePresence>

      {/* ================================================================= */}
      {/* SIDEBAR */}
      {/* ================================================================= */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r bg-card transition-transform duration-200 ${
          mobileMenu
            ? 'translate-x-0'
            : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">

          {/* Logo */}

          <motion.div
            className="flex h-20 items-center gap-3 border-b px-6"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"
              whileHover={{
                scale: 1.05,
                rotate: 2,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
              }}
            >
              <Shield className="size-5" />
            </motion.div>

            <div>
              <h1 className="font-bold">
                NMSight
              </h1>

              <p className="text-xs text-muted-foreground">
                Security Operations
              </p>
            </div>

            <button
              className="ml-auto lg:hidden"
              onClick={() => setMobileMenu(false)}
            >
              <X className="size-5" />
            </button>
          </motion.div>

          {/* Navigation */}

          <nav className="flex-1 space-y-1 p-4">

            <SidebarLink
              href="/security/dashboard"
              icon={
                <LayoutDashboard className="size-4" />
              }
              label="Dashboard"
              active
            />

            <SidebarLink
              href="/security/alerts"
              icon={<Bell className="size-4" />}
              label="Alerts"
              badge={alerts.length}
            />

            <SidebarLink
              href="/security/campus-zones"
              icon={<MapPin className="size-4" />}
              label="Campus Zones"
            />

          </nav>

          {/* System status */}

          <div className="px-4 pb-3">
            <div className="rounded-xl border bg-muted/40 p-3">

              <div className="flex items-center gap-2">

                <motion.span
                  className="size-2 rounded-full bg-green-500"
                  animate={{
                    opacity: [1, 0.45, 1],
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                <span className="text-xs font-medium">
                  System Operational
                </span>

              </div>

              <p className="mt-1 text-[11px] text-muted-foreground">
                Campus monitoring active
              </p>

            </div>
          </div>

          {/* Logged in user */}

          <motion.div
            className="border-t p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.4,
            }}
          >
            <div className="flex items-center gap-3 rounded-xl bg-muted/60 p-3">

              <motion.div
                className="flex size-9 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary"
                whileHover={{ scale: 1.08 }}
              >
                {userInitial}
              </motion.div>

              <div className="min-w-0">

                <p className="truncate text-sm font-medium">
                  {currentUser?.name ||
                    'Security Officer'}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  {currentUser?.email ||
                    'security@nmsight.com'}
                </p>

              </div>

            </div>
          </motion.div>

        </div>
      </aside>

      {/* ================================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================================= */}

      <main className="lg:pl-64">

        {/* ================================================================= */}
        {/* TOP BAR */}
        {/* ================================================================= */}

        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">

          <div className="flex items-center gap-3">

            <button
              className="rounded-lg p-2 transition-colors hover:bg-muted lg:hidden"
              onClick={() => setMobileMenu(true)}
            >
              <Menu className="size-5" />
            </button>

            <div>

              <h2 className="font-semibold">
                Security Dashboard
              </h2>

              <p className="text-xs text-muted-foreground sm:text-sm">
                Campus safety monitoring
              </p>

            </div>

          </div>

          {/* Notification */}

          <motion.button
            className="relative rounded-xl border bg-card p-2.5 hover:bg-muted"
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
          >
            <Bell className="size-5" />

            {alerts.length > 0 && (
              <motion.span
                className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] text-white"
                initial={{
                  scale: 0,
                }}
                animate={{
                  scale: 1,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                }}
              >
                {alerts.length}
              </motion.span>
            )}

          </motion.button>

        </header>

        {/* ================================================================= */}
        {/* PAGE */}
        {/* ================================================================= */}

        <div className="p-4 sm:p-6">

          {/* ================================================================= */}
          {/* WELCOME */}
          {/* ================================================================= */}

          <motion.div
            className="mb-6"
            variants={fadeUp}
          >
            <p className="text-xs font-semibold tracking-wider text-primary">
              LIVE OPERATIONS
            </p>

            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              {getGreeting()},{' '}
              {currentUser?.name ||
                'Security Officer'}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Here's the current safety status across campus.
            </p>
          </motion.div>

          {/* ================================================================= */}
          {/* STATISTICS */}
          {/* ================================================================= */}

          <motion.div
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            variants={cardContainer}
            initial="hidden"
            animate="visible"
          >

            <AnimatedStatCard
              icon={
                <AlertTriangle className="size-5" />
              }
              label="Active Alerts"
              value={activeAlertCount}
              description="Currently requiring attention"
            />

            <AnimatedStatCard
              icon={<Siren className="size-5" />}
              label="High Priority"
              value={highPriorityCount}
              description="Requires immediate response"
            />

            <AnimatedStatCard
              icon={<Users className="size-5" />}
              label="People Detected"
              value={peopleDetected}
              description="Across monitored zones"
            />

            <AnimatedStatCard
              icon={<MapPin className="size-5" />}
              label="Restricted Areas"
              value={restrictedZoneCount}
              description="Protected campus zones"
            />

          </motion.div>

          {/* ================================================================= */}
          {/* MAP + ALERTS */}
          {/* ================================================================= */}

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">

            {/* ================================================================= */}
            {/* CAMPUS MAP */}
            {/* ================================================================= */}

            <motion.section
              className="overflow-hidden rounded-2xl border bg-card shadow-sm"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              whileHover={{
                y: -2,
                transition: {
                  duration: 0.2,
                },
              }}
            >

              <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <h2 className="font-semibold">
                      VIT Vellore Campus
                    </h2>

                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      AI MONITORING
                    </span>

                  </div>

                  <p className="text-sm text-muted-foreground">
                    Security alerts and incident locations
                  </p>

                </div>

                <div className="flex items-center gap-2">

                  <motion.span
                    className="size-2 rounded-full bg-green-500"
                    animate={{
                      opacity: [1, 0.4, 1],
                      scale: [1, 1.15, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />

                  <span className="text-xs font-medium text-green-600">
                    Monitoring Active
                  </span>

                </div>

              </div>

              <div className="p-5">

                <CampusAlertMap
                  alerts={alerts}
                />

              </div>

            </motion.section>

            {/* ================================================================= */}
            {/* ACTIVE ALERTS */}
            {/* ================================================================= */}

            <motion.section
              className="overflow-hidden rounded-2xl border bg-card shadow-sm"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{
                delay: 0.15,
              }}
            >

              <div className="flex items-center justify-between border-b p-5">

                <div>

                  <h2 className="font-semibold">
                    Active Alerts
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Security attention required
                  </p>

                </div>

                <motion.span
                  key={activeAlertCount}
                  className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-600"
                  initial={{
                    scale: 0.8,
                  }}
                  animate={{
                    scale: 1,
                  }}
                >
                  {activeAlertCount} active
                </motion.span>

              </div>

              <motion.div
                className="divide-y"
                variants={listContainer}
                initial="hidden"
                animate="visible"
              >

                {loading ? (

                  <div className="p-10 text-center">

                    <motion.div
                      className="mx-auto size-5 rounded-full border-2 border-primary border-t-transparent"
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />

                    <p className="mt-3 text-sm text-muted-foreground">
                      Loading security alerts...
                    </p>

                  </div>

                ) : activeAlerts.length === 0 ? (

                  <motion.div
                    className="flex flex-col items-center justify-center p-12 text-center"
                    initial={{
                      opacity: 0,
                      scale: 0.95,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                  >

                    <CheckCircle2 className="size-10 text-green-500" />

                    <p className="mt-3 font-medium">
                      Campus is clear
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      No active alerts at the moment.
                    </p>

                  </motion.div>

                ) : (

                  <AnimatePresence mode="popLayout">

                    {activeAlerts.map((alert) => {

                      const severity =
                        normalizeSeverity(
                          alert.severity
                        )

                      return (
                        <motion.div
                          key={alert.id}
                          layout
                          variants={listItem}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="p-4"
                        >

                          <div className="flex gap-3">

                            {/* Severity */}

                            <div className="mt-1.5">

                              {(
                                severity === 'High' ||
                                severity === 'Critical'
                              ) ? (

                                <motion.span
                                  className={`block size-2.5 rounded-full ${severityDotClass(
                                    severity
                                  )}`}
                                  animate={{
                                    opacity: [
                                      1,
                                      0.45,
                                      1,
                                    ],
                                    scale: [
                                      1,
                                      1.2,
                                      1,
                                    ],
                                  }}
                                  transition={{
                                    duration: 1.6,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                  }}
                                />

                              ) : (

                                <span
                                  className={`block size-2.5 rounded-full ${severityDotClass(
                                    severity
                                  )}`}
                                />

                              )}

                            </div>

                            <div className="min-w-0 flex-1">

                              <div className="flex items-start justify-between gap-2">

                                <div>

                                  <p className="text-sm font-semibold">
                                    {alert.title}
                                  </p>

                                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">

                                    <MapPin className="size-3" />

                                    {alert.location ||
                                      'Campus'}

                                  </p>

                                </div>

                                <span className="whitespace-nowrap text-xs text-muted-foreground">
                                  {alert.time ||
                                    'Recently'}
                                </span>

                              </div>

                              <div className="mt-3 flex items-center justify-between">

                                <span
                                  className={`rounded-full px-2 py-1 text-[10px] font-semibold ${severityClass(
                                    severity
                                  )}`}
                                >
                                  {severity}
                                </span>

                                <motion.button
                                  onClick={() =>
                                    acknowledgeAlert(
                                      alert.id
                                    )
                                  }
                                  className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                                  whileHover={{
                                    scale: 1.03,
                                  }}
                                  whileTap={{
                                    scale: 0.97,
                                  }}
                                >
                                  Acknowledge
                                </motion.button>

                              </div>

                            </div>

                          </div>

                        </motion.div>
                      )
                    })}

                  </AnimatePresence>

                )}

              </motion.div>

            </motion.section>

          </div>

          {/* ================================================================= */}
          {/* RECENT SECURITY ACTIVITY */}
          {/* ================================================================= */}

          <motion.section
            className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-sm"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{
              delay: 0.3,
            }}
          >

            <div className="border-b p-5">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="font-semibold">
                    Recent Security Activity
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Latest events detected by NMSight
                  </p>

                </div>

                <div className="hidden items-center gap-2 sm:flex">

                  <span className="size-2 rounded-full bg-primary" />

                  <span className="text-xs text-muted-foreground">
                    Live activity
                  </span>

                </div>

              </div>

            </div>

            <motion.div
              className="divide-y"
              variants={listContainer}
              initial="hidden"
              animate="visible"
            >

              {loading ? (

                <div className="p-8 text-center">

                  <p className="text-sm text-muted-foreground">
                    Loading recent activity...
                  </p>

                </div>

              ) : alerts.length === 0 ? (

                <div className="p-8 text-center">

                  <p className="text-sm text-muted-foreground">
                    No recent security activity.
                  </p>

                </div>

              ) : (

                alerts.map((alert) => (

                  <motion.div
                    key={`activity-${alert.id}`}
                    variants={listItem}
                    whileHover={{
                      backgroundColor:
                        'rgba(255,255,255,0.02)',
                    }}
                  >

                    <Activity
                      icon={
                        normalizeSeverity(
                          alert.severity
                        ) === 'High' ||
                        normalizeSeverity(
                          alert.severity
                        ) === 'Critical'
                          ? (
                            <AlertTriangle className="size-4" />
                          )
                          : alert.title
                              ?.toLowerCase()
                              .includes('crowd')
                          ? (
                            <Users className="size-4" />
                          )
                          : (
                            <MapPin className="size-4" />
                          )
                      }
                      title={
                        alert.title ||
                        'Security Alert'
                      }
                      location={
                        alert.location ||
                        'Campus'
                      }
                      time={
                        alert.time ||
                        'Recently'
                      }
                      status={
                        alert.status ||
                        'Active'
                      }
                    />

                  </motion.div>

                ))

              )}

            </motion.div>

          </motion.section>

        </div>

      </main>

    </motion.div>
  )
}

/* ========================================================================= */
/* SIDEBAR LINK */
/* ========================================================================= */

function SidebarLink({
  href,
  icon,
  label,
  active = false,
  badge,
}) {
  return (
    <Link href={href}>

      <motion.div
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
          active
            ? 'bg-primary/10 font-medium text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
        whileHover={{
          x: 3,
        }}
        whileTap={{
          scale: 0.98,
        }}
        transition={{
          duration: 0.15,
        }}
      >

        {icon}

        <span className="flex-1">
          {label}
        </span>

        {badge !== undefined && (
          <motion.span
            key={badge}
            className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-600"
            initial={{
              scale: 0.8,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
          >
            {badge}
          </motion.span>
        )}

      </motion.div>

    </Link>
  )
}

/* ========================================================================= */
/* STAT CARD */
/* ========================================================================= */

function AnimatedStatCard({
  icon,
  label,
  value,
  description,
}) {
  return (
    <motion.div
      className="rounded-2xl border bg-card p-5 shadow-sm"
      variants={cardItem}
      whileHover={{
        y: -4,
        scale: 1.01,
        transition: {
          duration: 0.2,
        },
      }}
      whileTap={{
        scale: 0.99,
      }}
    >

      <div className="flex items-center justify-between">

        <motion.div
          className="rounded-xl bg-primary/10 p-2.5 text-primary"
          whileHover={{
            scale: 1.08,
            rotate: 2,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
          }}
        >
          {icon}
        </motion.div>

        <span className="flex items-center gap-1 text-xs font-medium text-green-600">

          <motion.span
            className="size-2 rounded-full bg-green-500"
            animate={{
              opacity: [1, 0.45, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />

          Live

        </span>

      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {label}
      </p>

      <motion.p
        key={value}
        className="mt-1 text-2xl font-bold"
        initial={{
          opacity: 0,
          y: 5,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.25,
        }}
      >
        {value}
      </motion.p>

      <p className="mt-1 text-xs text-muted-foreground">
        {description}
      </p>

    </motion.div>
  )
}

/* ========================================================================= */
/* ACTIVITY */
/* ========================================================================= */

function Activity({
  icon,
  title,
  location,
  time,
  status,
}) {
  return (
    <div className="flex items-center gap-4 p-4">

      <motion.div
        className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
        whileHover={{
          scale: 1.08,
        }}
      >
        {icon}
      </motion.div>

      <div className="min-w-0 flex-1">

        <p className="truncate text-sm font-medium">
          {title}
        </p>

        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">

          <MapPin className="size-3" />

          {location}

        </p>

      </div>

      <div className="hidden text-right sm:block">

        <p className="flex items-center justify-end gap-1 text-xs text-muted-foreground">

          <Clock3 className="size-3" />

          {time}

        </p>

        <p
          className={`mt-1 text-xs font-medium ${
            status === 'Active'
              ? 'text-red-600'
              : status === 'Resolved'
              ? 'text-green-600'
              : status === 'Investigating'
              ? 'text-yellow-600'
              : 'text-muted-foreground'
          }`}
        >
          {status}
        </p>

      </div>

    </div>
  )
}