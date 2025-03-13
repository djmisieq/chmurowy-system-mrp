/**
 * Testy dla BomValidationService
 * 
 * Testują główne funkcjonalności walidacji struktury BOM.
 */

import BomValidationService from '../BomValidationService';

describe('BomValidationService', () => {
  // Mock danych używanych w testach
  const mockBomItems = [
    {
      id: 'assembly1',
      name: 'Główny zespół',
      type: 'assembly',
      parentId: null,
      children: [
        {
          id: 'subassembly1',
          name: 'Podzespół 1',
          type: 'subassembly',
          parentId: 'assembly1',
          children: [
            {
              id: 'part1',
              name: 'Część 1',
              type: 'part',
              parentId: 'subassembly1',
              children: [
                {
                  id: 'material1',
                  name: 'Materiał 1',
                  type: 'material',
                  parentId: 'part1',
                  children: []
                }
              ]
            }
          ]
        },
        {
          id: 'part2',
          name: 'Część 2',
          type: 'part',
          parentId: 'assembly1',
          children: []
        }
      ]
    },
    {
      id: 'assembly2',
      name: 'Dodatkowy zespół',
      type: 'assembly',
      parentId: null,
      children: []
    }
  ];

  describe('validateMove()', () => {
    // Test 1: Prawidłowe przeniesienie elementu
    test('powinien zezwolić na prawidłowe przeniesienie elementu', () => {
      // Przenosimy 'part2' do 'assembly2'
      const result = BomValidationService.validateMove('part2', 'assembly2', mockBomItems);
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    // Test 2: Przeniesienie elementu do samego siebie
    test('powinien odrzucić przeniesienie elementu do samego siebie', () => {
      const result = BomValidationService.validateMove('part1', 'part1', mockBomItems);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('samego siebie');
    });

    // Test 3: Tworzenie cyklu w strukturze
    test('powinien odrzucić przeniesienie tworzące cykl w strukturze', () => {
      // Próba przeniesienia 'assembly1' do 'part1' (jego własny potomek)
      const result = BomValidationService.validateMove('assembly1', 'part1', mockBomItems);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('cykl');
    });

    // Test 4: Walidacja typów elementów
    test('powinien odrzucić przeniesienie niedozwolonego typu elementu', () => {
      // Próba przeniesienia 'assembly2' do 'material1' (materiał nie może mieć dzieci)
      const result = BomValidationService.validateMove('assembly2', 'material1', mockBomItems);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('typu');
    });
  });

  describe('validateFullBom()', () => {
    // Test 5: Walidacja poprawnej struktury BOM
    test('powinien zatwierdzić poprawną strukturę BOM', () => {
      const result = BomValidationService.validateFullBom(mockBomItems);
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    // Test 6: Wykrywanie duplikatów ID
    test('powinien wykryć duplikaty ID w strukturze BOM', () => {
      // Tworzymy strukturę z duplikatem ID
      const itemsWithDuplicateId = JSON.parse(JSON.stringify(mockBomItems));
      itemsWithDuplicateId[1].id = 'assembly1'; // Duplikat ID
      
      const result = BomValidationService.validateFullBom(itemsWithDuplicateId);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Duplikat ID');
    });

    // Test 7: Wykrywanie niedozwolonych relacji między typami
    test('powinien wykryć niedozwolone relacje typów w strukturze BOM', () => {
      // Tworzymy strukturę z niedozwoloną relacją (materiał jako rodzic części)
      const itemsWithInvalidRelation = JSON.parse(JSON.stringify(mockBomItems));
      // Zamieniamy typ Część 1 na materiał, ale nadal ma dziecko (co jest niedozwolone)
      const part1 = itemsWithInvalidRelation[0].children[0].children[0];
      part1.type = 'material';
      
      const result = BomValidationService.validateFullBom(itemsWithInvalidRelation);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Materiał nie może mieć dzieci');
    });

    // Test 8: Ostrzeżenia o głębokiej strukturze
    test('powinien generować ostrzeżenia dla głębokiej struktury', () => {
      // Tworzymy głęboką strukturę (przekraczającą zalecany limit głębokości)
      let deepItems = JSON.parse(JSON.stringify(mockBomItems));
      
      // Dodajemy więcej poziomów zagnieżdżenia
      let currentItem = deepItems[0].children[0].children[0].children[0]; // material1
      for (let i = 0; i < 10; i++) {
        const newItem = {
          id: `deep${i}`,
          name: `Głęboki element ${i}`,
          type: 'part',
          parentId: currentItem.id,
          children: []
        };
        currentItem.children = [newItem];
        currentItem = newItem;
      }
      
      const result = BomValidationService.validateFullBom(deepItems);
      
      // W tym przypadku struktura nadal może być technicznie poprawna, ale powinna zawierać ostrzeżenia
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(w => w.includes('głębokości'))).toBe(true);
    });
  });
});
