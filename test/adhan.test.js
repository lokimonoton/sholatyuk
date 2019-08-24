var expect = require("chai").expect;
var sholatyuk = require("../SholatYuk.js/index.js");
var moment = require("moment");
var tz = require("moment-timezone");
var formattedTime = sholatyuk.Date.formattedTime;
var dateByAddingSeconds = sholatyuk.Date.dateByAddingSeconds;

describe("High Latitude Rule", function() {
    it("Verifies the night portion defined by the high latitude rule", function() {
        var p1 = new sholatyuk.CalculationParameters(18, 18);
        p1.highLatitudeRule = sholatyuk.HighLatitudeRule.MiddleOfTheNight;
        expect(p1.nightPortions().fajr).to.equal(0.5);
        expect(p1.nightPortions().isha).to.equal(0.5);

        var p2 = new sholatyuk.CalculationParameters(18, 18);
        p2.highLatitudeRule = sholatyuk.HighLatitudeRule.SeventhOfTheNight;
        expect(p2.nightPortions().fajr).to.equal(1/7);
        expect(p2.nightPortions().isha).to.equal(1/7);

        var p3 = new sholatyuk.CalculationParameters(10, 15);
        p3.highLatitudeRule = sholatyuk.HighLatitudeRule.TwilightAngle;
        expect(p3.nightPortions().fajr).to.equal(10/60);
        expect(p3.nightPortions().isha).to.equal(15/60);
    });
});

describe("Calculation Method", function() {
    it("Verifies the angles defined by the calculation method", function() {
        var p1 = sholatyuk.CalculationMethod.MuslimWorldLeague();
        expect(p1.fajrAngle).to.equal(18);
        expect(p1.ishaAngle).to.equal(17);
        expect(p1.ishaInterval).to.equal(0);
        expect(p1.method).to.equal("MuslimWorldLeague");

        var p2 = sholatyuk.CalculationMethod.Egyptian();
        expect(p2.fajrAngle).to.equal(19.5);
        expect(p2.ishaAngle).to.equal(17.5);
        expect(p2.ishaInterval).to.equal(0);
        expect(p2.method).to.equal("Egyptian");

        var p3 = sholatyuk.CalculationMethod.Karachi();
        expect(p3.fajrAngle).to.equal(18);
        expect(p3.ishaAngle).to.equal(18);
        expect(p3.ishaInterval).to.equal(0);
        expect(p3.method).to.equal("Karachi");

        var p4 = sholatyuk.CalculationMethod.UmmAlQura();
        expect(p4.fajrAngle).to.equal(18.5);
        expect(p4.ishaAngle).to.equal(0);
        expect(p4.ishaInterval).to.equal(90);
        expect(p4.method).to.equal("UmmAlQura");

        var p5 = sholatyuk.CalculationMethod.Dubai();
        expect(p5.fajrAngle).to.equal(18.2);
        expect(p5.ishaAngle).to.equal(18.2);
        expect(p5.ishaInterval).to.equal(0);
        expect(p5.method).to.equal("Dubai");

        var p6 = sholatyuk.CalculationMethod.MoonsightingCommittee();
        expect(p6.fajrAngle).to.equal(18);
        expect(p6.ishaAngle).to.equal(18);
        expect(p6.ishaInterval).to.equal(0);
        expect(p6.method).to.equal("MoonsightingCommittee");

        var p7 = sholatyuk.CalculationMethod.NorthAmerica();
        expect(p7.fajrAngle).to.equal(15);
        expect(p7.ishaAngle).to.equal(15);
        expect(p7.ishaInterval).to.equal(0);
        expect(p7.method).to.equal("NorthAmerica");

        var p8 = sholatyuk.CalculationMethod.Other();
        expect(p8.fajrAngle).to.equal(0);
        expect(p8.ishaAngle).to.equal(0);
        expect(p8.ishaInterval).to.equal(0);
        expect(p8.method).to.equal("Other");

        var p9 = sholatyuk.CalculationMethod.Kuwait();
        expect(p9.fajrAngle).to.equal(18);
        expect(p9.ishaAngle).to.equal(17.5);
        expect(p9.ishaInterval).to.equal(0);
        expect(p9.method).to.equal("Kuwait");

        var p10 = sholatyuk.CalculationMethod.Qatar();
        expect(p10.fajrAngle).to.equal(18);
        expect(p10.ishaAngle).to.equal(0);
        expect(p10.ishaInterval).to.equal(90);
        expect(p10.method).to.equal("Qatar");
    });
});

describe("Prayer Times", function() {
    it("calculates prayer times", function() {
        var date = new Date(2015, 6, 12);
        var params = sholatyuk.CalculationMethod.NorthAmerica();
        params.madhab = sholatyuk.Madhab.Hanafi;
        var p = new sholatyuk.PrayerTimes(new sholatyuk.Coordinates(35.7750, -78.6336), date, params);

        expect(formattedTime(p.fajr, -4)).to.equal("4:42 AM");
        expect(formattedTime(p.sunrise, -4)).to.equal("6:08 AM");
        expect(formattedTime(p.dhuhr, -4)).to.equal("1:21 PM");
        expect(formattedTime(p.asr, -4)).to.equal("6:22 PM");
        expect(formattedTime(p.maghrib, -4)).to.equal("8:32 PM");
        expect(formattedTime(p.isha, -4)).to.equal("9:57 PM");
        expect(formattedTime(p.isha, -4, '24h')).to.equal("21:57");
        expect(moment(p.isha).tz("America/New_York").format("h:mm A")).to.equal("9:57 PM");
    });
});

describe("Prayer Time Offsets", function() {
    it("uses offsets to manually adjust prayer times", function() {
        var date = new Date(2015, 11, 1);
        var params = sholatyuk.CalculationMethod.MuslimWorldLeague();
        params.madhab = sholatyuk.Madhab.Shafi;
        var p = new sholatyuk.PrayerTimes(new sholatyuk.Coordinates(35.7750, -78.6336), date, params);
        expect(formattedTime(p.fajr, -5)).to.equal("5:35 AM");
        expect(formattedTime(p.sunrise, -5)).to.equal("7:06 AM");
        expect(formattedTime(p.dhuhr, -5)).to.equal("12:05 PM");
        expect(formattedTime(p.asr, -5)).to.equal("2:42 PM");
        expect(formattedTime(p.maghrib, -5)).to.equal("5:01 PM");
        expect(formattedTime(p.isha, -5)).to.equal("6:26 PM");

        params.adjustments.fajr = 10;
        params.adjustments.sunrise = 10;
        params.adjustments.dhuhr = 10;
        params.adjustments.asr = 10;
        params.adjustments.maghrib = 10;
        params.adjustments.isha = 10;

        var p2 = new sholatyuk.PrayerTimes(new sholatyuk.Coordinates(35.7750, -78.6336), date, params);
        expect(formattedTime(p2.fajr, -5)).to.equal("5:45 AM");
        expect(formattedTime(p2.sunrise, -5)).to.equal("7:16 AM");
        expect(formattedTime(p2.dhuhr, -5)).to.equal("12:15 PM");
        expect(formattedTime(p2.asr, -5)).to.equal("2:52 PM");
        expect(formattedTime(p2.maghrib, -5)).to.equal("5:11 PM");
        expect(formattedTime(p2.isha, -5)).to.equal("6:36 PM");
    });
});

describe("Moonsighting Committee Prayer Times", function() {
    it("calculates prayer times using the Moonsighting Committee calculation method", function() {
        // Values from http://www.moonsighting.com/pray.php
        var date = new Date(2016, 0, 31);
        var p = new sholatyuk.PrayerTimes(new sholatyuk.Coordinates(35.7750, -78.6336), date, sholatyuk.CalculationMethod.MoonsightingCommittee());
        expect(formattedTime(p.fajr, -5)).to.equal("5:48 AM");
        expect(formattedTime(p.sunrise, -5)).to.equal("7:16 AM");
        expect(formattedTime(p.dhuhr, -5)).to.equal("12:33 PM");
        expect(formattedTime(p.asr, -5)).to.equal("3:20 PM");
        expect(formattedTime(p.maghrib, -5)).to.equal("5:43 PM");
        expect(formattedTime(p.isha, -5)).to.equal("7:05 PM");
    });

    it("calculates Moonsighting Committee prayer times at a high latitude location", function() {
        // Values from http://www.moonsighting.com/pray.php
        var date = new Date(2016, 0, 1);
        var params = sholatyuk.CalculationMethod.MoonsightingCommittee();
        params.madhab = sholatyuk.Madhab.Hanafi;
        var p = new sholatyuk.PrayerTimes(new sholatyuk.Coordinates(59.9094, 10.7349), date, params);
        expect(moment(p.fajr).tz("Europe/Oslo").format("h:mm A")).to.equal("7:34 AM");
        expect(moment(p.sunrise).tz("Europe/Oslo").format("h:mm A")).to.equal("9:19 AM");
        expect(moment(p.dhuhr).tz("Europe/Oslo").format("h:mm A")).to.equal("12:25 PM");
        expect(moment(p.asr).tz("Europe/Oslo").format("h:mm A")).to.equal("1:36 PM");
        expect(moment(p.maghrib).tz("Europe/Oslo").format("h:mm A")).to.equal("3:25 PM");
        expect(moment(p.isha).tz("Europe/Oslo").format("h:mm A")).to.equal("5:02 PM");
    });    
});

describe("Prayer Time Convenience Functions", function() {
    it("gets the time for a given prayer", function() {
        var date = new Date(2016, 6, 1);
        var params = sholatyuk.CalculationMethod.MuslimWorldLeague();
        params.madhab = sholatyuk.Madhab.Hanafi;
        params.highLatitudeRule = sholatyuk.HighLatitudeRule.TwilightAngle;
        var p = new sholatyuk.PrayerTimes(new sholatyuk.Coordinates(59.9094, 10.7349), date, params);
        expect(p.timeForPrayer(sholatyuk.Prayer.Fajr)).to.equal(p.fajr);
        expect(p.timeForPrayer(sholatyuk.Prayer.Sunrise)).to.equal(p.sunrise);
        expect(p.timeForPrayer(sholatyuk.Prayer.Dhuhr)).to.equal(p.dhuhr);
        expect(p.timeForPrayer(sholatyuk.Prayer.Asr)).to.equal(p.asr);
        expect(p.timeForPrayer(sholatyuk.Prayer.Maghrib)).to.equal(p.maghrib);
        expect(p.timeForPrayer(sholatyuk.Prayer.Isha)).to.equal(p.isha);
        expect(p.timeForPrayer(sholatyuk.Prayer.None)).to.equal(null);
    });

    it("gets the current prayer", function() {
        var date = new Date(2015, 8, 1);
        var params = sholatyuk.CalculationMethod.Karachi();
        params.madhab = sholatyuk.Madhab.Hanafi;
        params.highLatitudeRule = sholatyuk.HighLatitudeRule.TwilightAngle;
        var p = new sholatyuk.PrayerTimes(new sholatyuk.Coordinates(33.720817, 73.090032), date, params);
        expect(p.currentPrayer(dateByAddingSeconds(p.fajr, -1))).to.equal(sholatyuk.Prayer.None);
        expect(p.currentPrayer(p.fajr)).to.equal(sholatyuk.Prayer.Fajr);
        expect(p.currentPrayer(dateByAddingSeconds(p.fajr, 1))).to.equal(sholatyuk.Prayer.Fajr);
        expect(p.currentPrayer(dateByAddingSeconds(p.sunrise, 1))).to.equal(sholatyuk.Prayer.Sunrise);
        expect(p.currentPrayer(dateByAddingSeconds(p.dhuhr, 1))).to.equal(sholatyuk.Prayer.Dhuhr);
        expect(p.currentPrayer(dateByAddingSeconds(p.asr, 1))).to.equal(sholatyuk.Prayer.Asr);
        expect(p.currentPrayer(dateByAddingSeconds(p.maghrib, 1))).to.equal(sholatyuk.Prayer.Maghrib);
        expect(p.currentPrayer(dateByAddingSeconds(p.isha, 1))).to.equal(sholatyuk.Prayer.Isha);
    });

    it("gets the next prayer", function() {
        var date = new Date(2015, 8, 1);
        var params = sholatyuk.CalculationMethod.Karachi();
        params.madhab = sholatyuk.Madhab.Hanafi;
        params.highLatitudeRule = sholatyuk.HighLatitudeRule.TwilightAngle;
        var p = new sholatyuk.PrayerTimes(new sholatyuk.Coordinates(33.720817, 73.090032), date, params);
        expect(p.nextPrayer(dateByAddingSeconds(p.fajr, -1))).to.equal(sholatyuk.Prayer.Fajr);
        expect(p.nextPrayer(p.fajr)).to.equal(sholatyuk.Prayer.Sunrise);
        expect(p.nextPrayer(dateByAddingSeconds(p.fajr, 1))).to.equal(sholatyuk.Prayer.Sunrise);
        expect(p.nextPrayer(dateByAddingSeconds(p.sunrise, 1))).to.equal(sholatyuk.Prayer.Dhuhr);
        expect(p.nextPrayer(dateByAddingSeconds(p.dhuhr, 1))).to.equal(sholatyuk.Prayer.Asr);
        expect(p.nextPrayer(dateByAddingSeconds(p.asr, 1))).to.equal(sholatyuk.Prayer.Maghrib);
        expect(p.nextPrayer(dateByAddingSeconds(p.maghrib, 1))).to.equal(sholatyuk.Prayer.Isha);
        expect(p.nextPrayer(dateByAddingSeconds(p.isha, 1))).to.equal(sholatyuk.Prayer.None);
    });
});

