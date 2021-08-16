const csv = require('csv-parser')
const fs = require('fs')
const puppeteer = require('puppeteer')
const mysql = require('mysql2')
const winston = require('winston')

const results = []

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

const connection = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'myphp'
})

fs.createReadStream('Anya_Config.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    (async () => {
      const allData = [] // массив объектов для записи в базу
      let arr = []
      const k = 0

      try {
        for (let i = 0; i < results.length; i++) {
          const browser = await puppeteer.launch({ headless: true })
          const page = await browser.newPage()

          await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36')

          await page.goto('https://www.doordash.com')
          await page.waitForXPath("//input[@aria-label='Your delivery address']")
          await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' })

          // ajax request for posting address

          const address_data = await page.evaluate((results, i) => {
            const data_0 = $.ajax({
              url: 'https://www.doordash.com/graphql',
              contentType: 'application/json',
              type: 'POST',
              data: JSON.stringify({
                operationName: 'addConsumerAddress',
                query: 'mutation addConsumerAddress($lat: Float!, $lng: Float!, $city: String!, $state: String!, $zipCode: String!, $printableAddress: String!, $shortname: String!, $googlePlaceId: String!, $subpremise: String, $driverInstructions: String, $dropoffOptionId: String, $manualLat: Float, $manualLng: Float) {\n  addConsumerAddress(lat: $lat, lng: $lng, city: $city, state: $state, zipCode: $zipCode, printableAddress: $printableAddress, shortname: $shortname, googlePlaceId: $googlePlaceId, subpremise: $subpremise, driverInstructions: $driverInstructions, dropoffOptionId: $dropoffOptionId, manualLat: $manualLat, manualLng: $manualLng) {\n    ...ConsumerFragment\n    __typename\n  }\n}\n\nfragment ConsumerFragment on Consumer {\n  id\n  timezone\n  firstName\n  lastName\n  localizedNames {\n    informalName\n    formalName\n    formalNameAbbreviated\n    __typename\n  }\n  email\n  phoneNumber\n  receiveTextNotifications\n  defaultCountry\n  isGuest\n  scheduledDeliveryTime\n  socialAccounts\n  accountCredits\n  dropoffOptions {\n    id\n    displayString\n    isDefault\n    isEnabled\n    placeholderText\n    disabledMessage\n    __typename\n  }\n  phoneNumberComponents {\n    formattedNationalNumber\n    nationalNumber\n    formattedInternationalNumber\n    countryCode\n    internationalNumber\n    countryShortname\n    __typename\n  }\n  referrerAmount {\n    unitAmount\n    currency\n    __typename\n  }\n  defaultAddress {\n    ...DefaultAddressFragment\n    __typename\n  }\n  availableAddresses {\n    id\n    street\n    city\n    subpremise\n    state\n    zipCode\n    lat\n    lng\n    manualLat\n    manualLng\n    shortname\n    printableAddress\n    driverInstructions\n    dropoffPreferences {\n      allPreferences {\n        optionId\n        isDefault\n        instructions\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  districtAvailability {\n    isDistrictActive\n    times\n    isOrderTimesMigrationActive\n    __typename\n  }\n  orderCart {\n    ...ConsumerOrderCartFragment\n    __typename\n  }\n  activeSubscription {\n    ...SubscriptionFragment\n    __typename\n  }\n  allSubscriptionPlans {\n    ...ConsumerSubscriptionPlanFragment\n    __typename\n  }\n  __typename\n}\n\nfragment DefaultAddressFragment on DefaultAddress {\n  id\n  street\n  city\n  subpremise\n  state\n  zipCode\n  country\n  countryCode\n  lat\n  lng\n  manualLat\n  manualLng\n  timezone\n  shortname\n  printableAddress\n  driverInstructions\n  dropoffPreferences {\n    allPreferences {\n      optionId\n      isDefault\n      instructions\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment ConsumerOrderCartFragment on OrderCart {\n  id\n  hasError\n  isConsumerPickup\n  isConvenienceCart\n  isMerchantShipping\n  offersDelivery\n  offersPickup\n  subtotal\n  topOffEnabled\n  urlCode\n  groupCart\n  groupCartPollInterval\n  shortenedUrl\n  maxIndividualCost\n  locked\n  serviceRateMessage\n  isOutsideDeliveryRegion\n  currencyCode\n  menu {\n    id\n    hoursToOrderInAdvance\n    name\n    minOrderSize\n    isBusinessEnabled\n    isCatering\n    __typename\n  }\n  creator {\n    id\n    firstName\n    lastName\n    localizedNames {\n      informalName\n      formalName\n      formalNameAbbreviated\n      __typename\n    }\n    __typename\n  }\n  deliveries {\n    id\n    quotedDeliveryTime\n    __typename\n  }\n  submittedAt\n  restaurant {\n    id\n    maxOrderSize\n    coverImgUrl\n    slug\n    address {\n      printableAddress\n      street\n      lat\n      lng\n      __typename\n    }\n    business {\n      name\n      __typename\n    }\n    __typename\n  }\n  storeDisclaimers {\n    id\n    disclaimerDetailsLink\n    disclaimerLinkSubstring\n    disclaimerText\n    displayTreatment\n    __typename\n  }\n  orders {\n    ...ConsumerOrdersFragment\n    __typename\n  }\n  topOffItem {\n    orderId\n    item {\n      description\n      price\n      updatedAt\n      id\n      name\n      __typename\n    }\n    topOff {\n      topOffSubtotal\n      topOffTotal\n      taxes\n      orderSubtotal\n      serviceFee\n      minChargeFee\n      serviceFeeMessage\n      __typename\n    }\n    __typename\n  }\n  teamAccount {\n    id\n    name\n    __typename\n  }\n  __typename\n}\n\nfragment ConsumerOrdersFragment on Order {\n  id\n  consumer {\n    firstName\n    lastName\n    id\n    localizedNames {\n      informalName\n      formalName\n      formalNameAbbreviated\n      __typename\n    }\n    __typename\n  }\n  isSubCartFinalized\n  orderItems {\n    id\n    options {\n      id\n      name\n      quantity\n      nestedOptions\n      __typename\n    }\n    nestedOptions\n    specialInstructions\n    substitutionPreference\n    quantity\n    singlePrice\n    priceOfTotalQuantity\n    continuousQuantity\n    unit\n    purchaseType\n    estimatedPricingDescription\n    item {\n      id\n      imageUrl\n      name\n      price\n      minAgeRequirement\n      category {\n        title\n        __typename\n      }\n      extras {\n        id\n        title\n        description\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  paymentCard {\n    id\n    stripeId\n    __typename\n  }\n  paymentLineItems {\n    subtotal\n    taxAmount\n    subtotalTaxAmount\n    feesTaxAmount\n    serviceFee\n    __typename\n  }\n  __typename\n}\n\nfragment SubscriptionFragment on Subscription {\n  subscriptionStatus\n  id\n  subscriptionPlan {\n    isPartnerPlan\n    allowAllStores\n    id\n    numEligibleStores\n    __typename\n  }\n  __typename\n}\n\nfragment ConsumerSubscriptionPlanFragment on ConsumerSubscriptionPlan {\n  allowAllStores\n  id\n  numEligibleStores\n  isCorporatePlan\n  __typename\n}\n',
                variables: {
                  city: results[i].city,
                  googlePlaceId: results[i].googlePlaceId,
                  lat: parseFloat(results[i].lat),
                  lng: parseFloat(results[i].lng),
                  printableAddress: '',
                  shortname: '',
                  state: results[i].state,
                  street: results[i].street_address,
                  zipCode: ''
                }

              }),
              success: function (succeed, SuccessTextStatus, jqXHR) {
                console.log({ succeed, SuccessTextStatus, jqXHR })
              },
              error: function (jqXHR, status) {
                console.log({ jqXHR, status })
              }
            })
            return data_0
          }, results, i)

          // ajax request for getting cafes data

          const doc_1 = await page.evaluate(() => {
            const data_1 = $.ajax({
              url: 'https://www.doordash.com/graphql',
              contentType: 'application/json',
              type: 'POST',
              data: JSON.stringify({
                operationName: 'homepageFeed',
                query: 'query homepageFeed($isFeedServiceMigration: Boolean, $cursor: String) {\n  homepageFeed(isFeedServiceMigration: $isFeedServiceMigration, cursor: $cursor) {\n    storeList {\n      id\n      type\n      sortOrder\n      next {\n        cursor\n        __typename\n      }\n      data {\n        totalStores\n        stores {\n          ...FeedServiceStoreResultFragment\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    storeCarousels {\n      id\n      type\n      sortOrder\n      next {\n        cursor\n        __typename\n      }\n      data {\n        id\n        title\n        name\n        description\n        isPickupCarousel\n        carouselStoreOrder\n        stores {\n          ... on CarouselStore {\n            ...CarouselStoreResultFragment\n            __typename\n          }\n          ... on Deal {\n            ...DealContentFragment\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment FeedServiceStoreResultFragment on Store {\n  id\n  name\n  description\n  averageRating\n  numRatings\n  numRatingsDisplayString\n  priceRange\n  priceRangeDisplayString\n  displayDeliveryFee\n  headerImgUrl\n  url\n  isConsumerSubscriptionEligible\n  isSurging\n  menus {\n    popularItems {\n      id\n      imgUrl\n      __typename\n    }\n    __typename\n  }\n  status {\n    asapAvailable\n    pickupAvailable\n    scheduledAvailable\n    asapMinutesRange\n    asapPickupMinutesRange\n    displayNextHours\n    deliveryUnavailableReason\n    __typename\n  }\n  badge {\n    backgroundColor\n    text\n    __typename\n  }\n  storeBadges {\n    type\n    text\n    backgroundColor\n    __typename\n  }\n  __typename\n}\n\nfragment CarouselStoreResultFragment on CarouselStore {\n  id\n  name\n  description\n  averageRating\n  deliveryFee\n  displayDeliveryFee\n  distanceFromConsumer\n  distanceFromConsumerInMeters\n  distanceFromConsumerString\n  headerImgUrl\n  isConsumerSubscriptionEligible\n  isSurging\n  menus {\n    popularItems {\n      imgUrl\n      __typename\n    }\n    __typename\n  }\n  numRatings\n  numRatingsDisplayString\n  priceRange\n  status {\n    asapAvailable\n    scheduledAvailable\n    asapMinutesRange\n    asapPickupMinutesRange\n    __typename\n  }\n  url\n  badge {\n    backgroundColor\n    text\n    __typename\n  }\n  storeBadges {\n    type\n    text\n    backgroundColor\n    __typename\n  }\n  __typename\n}\n\nfragment DealContentFragment on Deal {\n  id\n  title\n  description\n  type\n  imageUrl\n  url\n  badge {\n    text\n    backgroundColor\n    __typename\n  }\n  store {\n    name\n    id\n    isDashpassPartner\n    averageRating\n    numRatings\n    numRatingsDisplayString\n    status {\n      asapAvailable\n      scheduledAvailable\n      asapMinutesRange\n      asapPickupMinutesRange\n      nextOpenTime\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n',
                variables: {
                  isFeedServiceMigration: true
                }
              }),
              success: function (data, SuccessTextStatus, jqXHR) {
                console.log({ data, SuccessTextStatus, jqXHR })
              },
              error: function (jqXHR, status) {
                console.log({ jqXHR, status })
              }
            })
            return data_1
          })

          if (doc_1.data.homepageFeed.storeList === null) {
            i--
          } else {
            const storesLength_1 = parseInt(doc_1.data.homepageFeed.storeList[k].data.stores.length)

            for (let i = 0; i < storesLength_1; i++) {
              const obj = {
                address: address_data.data.addConsumerAddress.defaultAddress.printableAddress !== null
                  ? address_data.data.addConsumerAddress.defaultAddress.printableAddress
                  : 'No Address',
                title: doc_1.data.homepageFeed.storeList[k].data.stores[i].name !== null
                  ? doc_1.data.homepageFeed.storeList[k].data.stores[i].name
                  : 'No name',
                rating: parseInt((doc_1.data.homepageFeed.storeList[k].data.stores[i].averageRating) * 10) / 10,
                cost: doc_1.data.homepageFeed.storeList[k].data.stores[i].displayDeliveryFee,
                time: doc_1.data.homepageFeed.storeList[k].data.stores[i].status.asapMinutesRange[0] !== null
                  ? doc_1.data.homepageFeed.storeList[k].data.stores[i].status.asapMinutesRange[0]
                  : 'Closed',
                status: doc_1.data.homepageFeed.storeList[k].data.stores[i].status.asapAvailable !== false
                  ? 'Opened'
                  : 'Closed'
              }
              await arr.push(obj)
            }

            let cursorData = doc_1.data.homepageFeed.storeList[k].next.cursor

            // ajax request for getting cafes data with cursor

            while (cursorData) {
              const doc_2 = await page.evaluate((cursorData) => {
                const data_2 = $.ajax({
                  url: 'https://www.doordash.com/graphql',
                  contentType: 'application/json',
                  type: 'POST',
                  data: JSON.stringify({
                    operationName: 'homepageFeed',
                    query: 'query homepageFeed($isFeedServiceMigration: Boolean, $cursor: String) {\n  homepageFeed(isFeedServiceMigration: $isFeedServiceMigration, cursor: $cursor) {\n    storeList {\n      id\n      type\n      sortOrder\n      next {\n        cursor\n        __typename\n      }\n      data {\n        totalStores\n        stores {\n          ...FeedServiceStoreResultFragment\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    storeCarousels {\n      id\n      type\n      sortOrder\n      next {\n        cursor\n        __typename\n      }\n      data {\n        id\n        title\n        name\n        description\n        isPickupCarousel\n        carouselStoreOrder\n        stores {\n          ... on CarouselStore {\n            ...CarouselStoreResultFragment\n            __typename\n          }\n          ... on Deal {\n            ...DealContentFragment\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment FeedServiceStoreResultFragment on Store {\n  id\n  name\n  description\n  averageRating\n  numRatings\n  numRatingsDisplayString\n  priceRange\n  priceRangeDisplayString\n  displayDeliveryFee\n  headerImgUrl\n  url\n  isConsumerSubscriptionEligible\n  isSurging\n  menus {\n    popularItems {\n      id\n      imgUrl\n      __typename\n    }\n    __typename\n  }\n  status {\n    asapAvailable\n    pickupAvailable\n    scheduledAvailable\n    asapMinutesRange\n    asapPickupMinutesRange\n    displayNextHours\n    deliveryUnavailableReason\n    __typename\n  }\n  badge {\n    backgroundColor\n    text\n    __typename\n  }\n  storeBadges {\n    type\n    text\n    backgroundColor\n    __typename\n  }\n  __typename\n}\n\nfragment CarouselStoreResultFragment on CarouselStore {\n  id\n  name\n  description\n  averageRating\n  deliveryFee\n  displayDeliveryFee\n  distanceFromConsumer\n  distanceFromConsumerInMeters\n  distanceFromConsumerString\n  headerImgUrl\n  isConsumerSubscriptionEligible\n  isSurging\n  menus {\n    popularItems {\n      imgUrl\n      __typename\n    }\n    __typename\n  }\n  numRatings\n  numRatingsDisplayString\n  priceRange\n  status {\n    asapAvailable\n    scheduledAvailable\n    asapMinutesRange\n    asapPickupMinutesRange\n    __typename\n  }\n  url\n  badge {\n    backgroundColor\n    text\n    __typename\n  }\n  storeBadges {\n    type\n    text\n    backgroundColor\n    __typename\n  }\n  __typename\n}\n\nfragment DealContentFragment on Deal {\n  id\n  title\n  description\n  type\n  imageUrl\n  url\n  badge {\n    text\n    backgroundColor\n    __typename\n  }\n  store {\n    name\n    id\n    isDashpassPartner\n    averageRating\n    numRatings\n    numRatingsDisplayString\n    status {\n      asapAvailable\n      scheduledAvailable\n      asapMinutesRange\n      asapPickupMinutesRange\n      nextOpenTime\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n',
                    variables: {
                      cursor: cursorData,
                      isFeedServiceMigration: true
                    }
                  }),
                  success: function (data, SuccessTextStatus, jqXHR) {
                    // console.log({data, SuccessTextStatus, jqXHR})
                  },
                  error: function (jqXHR, status) {
                    console.log({ jqXHR, status })
                  }
                })
                return data_2
              }, cursorData)

              const storesLength_2 = parseInt(doc_2.data.homepageFeed.storeList[k].data.stores.length)

              for (let i = 0; i < storesLength_2; i++) {
                const obj = {
                  address: address_data.data.addConsumerAddress.defaultAddress.printableAddress !== null
                    ? address_data.data.addConsumerAddress.defaultAddress.printableAddress
                    : 'No Address',
                  title: doc_2.data.homepageFeed.storeList[k].data.stores[i].name !== null
                    ? doc_2.data.homepageFeed.storeList[k].data.stores[i].name
                    : 'No name',
                  rating: parseInt((doc_2.data.homepageFeed.storeList[k].data.stores[i].averageRating) * 10) / 10,
                  cost: doc_2.data.homepageFeed.storeList[k].data.stores[i].displayDeliveryFee,
                  time: doc_2.data.homepageFeed.storeList[k].data.stores[i].status.asapMinutesRange[0] !== null
                    ? doc_2.data.homepageFeed.storeList[k].data.stores[i].status.asapMinutesRange[0]
                    : 'Closed',
                  status: doc_2.data.homepageFeed.storeList[k].data.stores[i].status.asapAvailable !== false
                    ? 'Opened'
                    : 'Closed'
                }
                await arr.push(obj)
              }

              cursorData = doc_2.data.homepageFeed.storeList[k].next.cursor
            }

            arr = arr.flat()

            logger.info(i)
            logger.info(arr[i].title)
          }

          await browser.close()
        }

        arr = arr.flat()
        logger.info(arr.length)

        // creating array of objects
        for (let i = 0; i < arr.length; i++) {
          const everyData = [arr[i].address, arr[i].title, arr[i].time, arr[i].cost, arr[i].rating, arr[i].status]
          allData.push(everyData)
        }

        // write data in MySQL
        const sql = 'INSERT INTO doordash(address, title, time, cost, rating, status) VALUES ?'
        connection.query(sql, [allData], function (err) {
          if (err) throw err
          else logger.info('Данные добавлены')
        })
      } catch (e) {
        logger.error(e)
      }
    })()
  })