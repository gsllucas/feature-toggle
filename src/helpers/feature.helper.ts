export class FeatureHelper {
  public static getAvailabilityByInstitution(
    institutions: number[],
    institutionId: number
  ): boolean {
    const idIndex = institutions.findIndex((id) => id === institutionId);
    const isValidIndex = idIndex !== -1;
    return isValidIndex;
  }
}
