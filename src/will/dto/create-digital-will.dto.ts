export class BeneficiaryDto {
  name: string;
  allocation: string;
}

export class CreateDigitalWillDto {
  personalInfo: {
    fullName: string;
    identification: string;
  };
  beneficiaries: BeneficiaryDto[];
  assets: Record<string, any>;
}
