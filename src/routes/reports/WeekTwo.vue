<template lang="pug">
article.week-two
  h1 Rapport vecka 2
  p
    a(href="https://github.com/ifaxity/jsramverk") Länk till github repo

  h2 Formulärdesign
  p
    | Designen på kalendern är inspirerad från Googles Material Design.
    | Eftersom Material Design har bra riktlinjer för responsiv design 
    | och är inte speciellt svårt att efterlikna, så kollade på en design av 
    a(href="https://vuematerial.io/components/datepicker/") Vue Material
    | , som är en implementation av Material Design för just Vue.
    | Men kollade faktiskt inte på källkoden, utan försökte efterlikna designen på mitt sätt.
    | Eftersom jag är ganska erfaren inom Vue så kände jag att det inte var ett problem.
  p
   | Registreringsformuläret är också lite inspirerad av Material Design.
   | Textfälten använder sig av en flytande label som flyttar sig när fälet får fokus eller har ett värde.
   | Så att användaren kan se labeln och ha värdet i textlådan samtidigt.
   | Gillar speciellt den designen för det känns modernt och är även lite häftigt.
</template>

<script>
export default {
  name: 'WeekTwo',
};
</script>
