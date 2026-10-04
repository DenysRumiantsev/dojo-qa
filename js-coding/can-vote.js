export const canVoteMessage = "Ви можете голосувати.";
export const cannotVoteMessage = "Ви ще не можете голосувати.";

export function canVote(age) {

    if (typeof age !== "number") {
        throw new Error("Передайте число");
    } 
     if (Number.isNaN(age)) {
        throw new Error("Передайте число");
    } 
    
    if (age < 18) {
        console.log(`Повертайся через ${(18 * 365) - (age * 365)} Днів`)
        return cannotVoteMessage;
    }
    else {
        return canVoteMessage;
    };
};