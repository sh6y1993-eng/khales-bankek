/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import {
  AiDifficulty,
  AppSettings,
  CardSelectionSource,
  IPhoneViewportId,
  MatchOutcome,
  PlayingCardData,
  PrototypeBoardState,
  RoomConfig,
  SampleRoom,
  ScreenId,
  UserProfile,
} from './types/prototype';
import { DESIGN_ASSETS } from './theme/designTokens';
import { soundFx } from './utils/soundFx';
import {
  applyProgressionRewardToProfile,
  INITIAL_PLAYER_ACCOUNTS,
  loadAccountsStore,
  PlayerAccountsMap,
  resolveOrCreateAccount,
  saveAccountsStore,
} from './services/playerAccountService';
import {
  SAMPLE_MULTIPLAYER_ROOMS,
  autoPassPlayerTurnOnTimeout,
  buildMatchOutcome,
  canEndPlayerTurn,
  canMoveCardToDoor,
  canPlayCardToCenter,
  createInitialBoardState,
  drawCardToHand,
  endPlayerTurnManually,
  moveSelectedToDoor,
  playSelectedToCenter,
  selectCardInBoard,
  simulateOpponentTurnStep,
  sortPlayerHand,
} from './services/prototypeGameController';
import { IPhoneShell } from './components/ui/IPhoneShell';
import { ConfirmModal } from './components/ui/ConfirmModal';
import { RulesSheet } from './components/ui/RulesSheet';
import { SplashScreen } from './screens/SplashScreen';
import { AuthScreen } from './screens/AuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ModeSelectScreen } from './screens/ModeSelectScreen';
import { AiSetupScreen } from './screens/AiSetupScreen';
import { MultiplayerHubScreen } from './screens/MultiplayerHubScreen';
import { CreateRoomScreen } from './screens/CreateRoomScreen';
import { JoinRoomScreen } from './screens/JoinRoomScreen';
import { RoomLobbyScreen } from './screens/RoomLobbyScreen';
import { GameBoardScreen } from './screens/GameBoardScreen';
import { Table3DGameBoard } from './screens/Table3DGameBoard';
import { ResultsScreen } from './screens/ResultsScreen';
import { ProfileSettingsScreen } from './screens/ProfileSettingsScreen';

export default function App() {
  const [screen, setScreen] = useState<ScreenId>('splash');
  const [viewport, setViewport] = useState<IPhoneViewportId>('standard');

  const [settings, setSettings] = useState<AppSettings>({
    soundEnabled: true,
    hapticsEnabled: true,
    preferredTurnSeconds: 30,
    largeCardText: false,
    boardStyle: 'table3d',
  });

  const [accountsStore, setAccountsStore] = useState<{
    accounts: PlayerAccountsMap;
    activeId: string;
  }>(() => loadAccountsStore());

  const profile: UserProfile =
    accountsStore.accounts[accountsStore.activeId] ?? INITIAL_PLAYER_ACCOUNTS.ahmed;

  const updateActiveProfile = (updater: (prev: UserProfile) => UserProfile) => {
    setAccountsStore((prevStore) => {
      const current =
        prevStore.accounts[prevStore.activeId] ?? INITIAL_PLAYER_ACCOUNTS.ahmed;
      const updated = updater(current);
      const nextAccounts = {
        ...prevStore.accounts,
        [prevStore.activeId]: updated,
      };
      saveAccountsStore(nextAccounts, prevStore.activeId);
      return {
        accounts: nextAccounts,
        activeId: prevStore.activeId,
      };
    });
  };

  const switchActiveAccount = (name: string, isGuest: boolean) => {
    setAccountsStore((prevStore) => {
      const { nextAccounts, accountId } = resolveOrCreateAccount(
        prevStore.accounts,
        name,
        isGuest
      );
      saveAccountsStore(nextAccounts, accountId);
      return {
        accounts: nextAccounts,
        activeId: accountId,
      };
    });
  };

  const [sampleRooms] = useState<SampleRoom[]>(SAMPLE_MULTIPLAYER_ROOMS);
  const [activeRoom, setActiveRoom] = useState<RoomConfig>({
    code: 'KH-740',
    name: 'مجلس خلّص بنكك',
    isLocked: false,
    isPrivate: true,
    turnDurationSeconds: 30,
    allowSpectators: false,
    players: [
      {
        id: 'host',
        name: 'سلطان المري',
        isHost: true,
        isReady: true,
        avatar: DESIGN_ASSETS.avatarPlayer,
      },
      {
        id: 'guest',
        name: 'فهد الشمري (تجريبي)',
        isHost: false,
        isReady: true,
        avatar: DESIGN_ASSETS.avatarOpponent,
      },
    ],
  });

  const [board, setBoard] = useState<PrototypeBoardState>(() =>
    createInitialBoardState({ turnDurationSeconds: 30 })
  );

  const [outcome, setOutcome] = useState<MatchOutcome>({
    winner: 'player',
    reason: 'تم تفريغ جميع بطاقات البنك بنجاح في هذا العرض التجريبي.',
    remainingPlayerBank: 0,
    remainingOpponentBank: 3,
    turnsPlayed: 9,
    movesPlayed: 22,
  });

  const [rulesOpen, setRulesOpen] = useState(false);
  const [exitMatchConfirm, setExitMatchConfirm] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [deleteAccountConfirm, setDeleteAccountConfirm] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
  };

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 2400);
    return () => clearTimeout(t);
  }, [toastMsg]);

  const navigate = (next: ScreenId) => {
    soundFx.click(settings.soundEnabled, settings.hapticsEnabled);
    setScreen(next);
  };

  // Turn countdown timer while on GameBoardScreen
  useEffect(() => {
    if (screen !== 'game-board') return;
    const interval = setInterval(() => {
      setBoard((prev) => {
        if (prev.turnSecondsLeft <= 1) {
          if (prev.turnOwner === 'player') {
            return autoPassPlayerTurnOnTimeout(prev);
          }
          return prev;
        }
        return {
          ...prev,
          turnSecondsLeft: prev.turnSecondsLeft - 1,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [screen]);

  // Simulated opponent move after short delay
  useEffect(() => {
    if (screen !== 'game-board' || board.turnOwner !== 'opponent') return;
    const timer = setTimeout(() => {
      setBoard((prev) => {
        if (prev.turnOwner !== 'opponent') return prev;
        const next = simulateOpponentTurnStep(prev);
        soundFx.turnSwitch(settings.soundEnabled, settings.hapticsEnabled);
        return next;
      });
    }, 950);
    return () => clearTimeout(timer);
  }, [screen, board.turnOwner, settings.soundEnabled, settings.hapticsEnabled]);

  // Automatic victory when player empties Bank
  useEffect(() => {
    if (screen !== 'game-board') return;
    if (board.playerBank.length === 0) {
      const winOutcome = buildMatchOutcome(
        board,
        'player',
        'أحسنت! قمت بتفريغ آخر بطاقة في بنكك قبل خصمك.'
      );
      setOutcome(winOutcome);
      updateActiveProfile((p) => applyProgressionRewardToProfile(p, 600, 450, 1, 1));
      soundFx.victory(settings.soundEnabled, settings.hapticsEnabled);
      setScreen('results');
    }
  }, [screen, board, settings.soundEnabled, settings.hapticsEnabled]);

  const startAiMatch = (difficulty: AiDifficulty, turnSeconds: number) => {
    soundFx.turnSwitch(settings.soundEnabled, settings.hapticsEnabled);
    const diffLabel =
      difficulty === 'beginner'
        ? 'مبتدئ'
        : difficulty === 'skilled'
        ? 'متمرس'
        : 'محترف';
    setBoard(
      createInitialBoardState({
        matchLabel: `ضد الكمبيوتر · ${diffLabel}`,
        isAiMatch: true,
        difficulty,
        turnDurationSeconds: turnSeconds,
      })
    );
    setScreen('game-board');
  };

  const startRoomMatch = () => {
    soundFx.turnSwitch(settings.soundEnabled, settings.hapticsEnabled);
    setBoard(
      createInitialBoardState({
        matchLabel: `غرفة ${activeRoom.code} · ${activeRoom.name}`,
        isAiMatch: false,
        turnDurationSeconds: activeRoom.turnDurationSeconds,
      })
    );
    setScreen('game-board');
  };

  const handleSelectCard = (card: PlayingCardData, source: CardSelectionSource) => {
    soundFx.cardSelect(settings.soundEnabled, settings.hapticsEnabled);
    setBoard((prev) => selectCardInBoard(prev, card, source));
  };

  const handlePlayToCenter = (pileIndex: number) => {
    if (board.turnOwner === 'player' && board.selected) {
      const check = canPlayCardToCenter(
        board.selected.card,
        board.centerPiles[pileIndex] ?? [],
        pileIndex
      );
      if (!check.valid) {
        soundFx.invalidMove(settings.soundEnabled, settings.hapticsEnabled);
        if (check.reason) showToast(check.reason);
        setBoard((prev) => playSelectedToCenter(prev, pileIndex));
        return;
      }
    }
    soundFx.cardPlace(settings.soundEnabled, settings.hapticsEnabled);
    setBoard((prev) => playSelectedToCenter(prev, pileIndex));
  };

  const handleMoveToDoor = (doorIndex: number) => {
    if (board.turnOwner === 'player' && board.selected) {
      const check = canMoveCardToDoor(
        board.selected.card,
        board.selected.source,
        board.playerDoors[doorIndex] ?? [],
        doorIndex
      );
      if (!check.valid) {
        soundFx.invalidMove(settings.soundEnabled, settings.hapticsEnabled);
        if (check.reason) showToast(check.reason);
        setBoard((prev) => moveSelectedToDoor(prev, doorIndex));
        return;
      }
    }
    soundFx.cardPlace(settings.soundEnabled, settings.hapticsEnabled);
    setBoard((prev) => moveSelectedToDoor(prev, doorIndex));
  };

  const handleDrawCard = () => {
    soundFx.cardDraw(settings.soundEnabled, settings.hapticsEnabled);
    setBoard((prev) => drawCardToHand(prev));
  };

  const handleSortHand = () => {
    soundFx.click(settings.soundEnabled, settings.hapticsEnabled);
    setBoard((prev) => sortPlayerHand(prev));
  };

  const handleEndTurn = () => {
    const check = canEndPlayerTurn(board);
    if (!check.allowed) {
      soundFx.invalidMove(settings.soundEnabled, settings.hapticsEnabled);
      if (check.reason) showToast(check.reason);
      setBoard((prev) => endPlayerTurnManually(prev));
      return;
    }
    soundFx.turnSwitch(settings.soundEnabled, settings.hapticsEnabled);
    setBoard((prev) => endPlayerTurnManually(prev));
  };

  const handleSimulateOutcome = (winner: 'player' | 'opponent') => {
    const result = buildMatchOutcome(
      board,
      winner,
      winner === 'player'
        ? 'تم تفريغ البنك بالكامل بنجاح في المعاينة التفاعلية.'
        : 'تمكن الخصم من تفريغ بنكه أولاً في المعاينة التفاعلية.'
    );
    setOutcome(result);
    updateActiveProfile((p) =>
      applyProgressionRewardToProfile(
        p,
        winner === 'player' ? 600 : 150,
        winner === 'player' ? 450 : 120,
        1,
        winner === 'player' ? 1 : 0
      )
    );
    if (winner === 'player') {
      soundFx.victory(settings.soundEnabled, settings.hapticsEnabled);
    } else {
      soundFx.defeat(settings.soundEnabled, settings.hapticsEnabled);
    }
    setScreen('results');
  };

  const handleCreateRoom = (payload: {
    name: string;
    isPrivate: boolean;
    turnDurationSeconds: number;
    allowSpectators: boolean;
  }) => {
    const randomNum = Math.floor(100 + Math.random() * 899);
    setActiveRoom({
      code: `KH-${randomNum}`,
      name: payload.name,
      isLocked: false,
      isPrivate: payload.isPrivate,
      turnDurationSeconds: payload.turnDurationSeconds,
      allowSpectators: payload.allowSpectators,
      players: [
        {
          id: 'host',
          name: profile.name,
          isHost: true,
          isReady: true,
          avatar: profile.avatar,
        },
      ],
    });
    soundFx.click(settings.soundEnabled, settings.hapticsEnabled);
    setScreen('room-lobby');
    showToast('تم فتح الغرفة التجريبية بنجاح');
  };

  const handleJoinByCode = (code: string): string | null => {
    const found = sampleRooms.find((r) => r.code === code);
    if (!found) {
      return 'لم يتم العثور على غرفة بهذا الرمز في القائمة التجريبية';
    }
    if (found.isLocked) {
      return 'هذه الغرفة مغلقة حالياً من قبل المضيف';
    }
    setActiveRoom({
      code: found.code,
      name: found.name,
      isLocked: found.isLocked,
      isPrivate: true,
      turnDurationSeconds: found.turnDurationSeconds,
      allowSpectators: false,
      players: [
        {
          id: 'host',
          name: found.hostName,
          isHost: true,
          isReady: true,
          avatar: DESIGN_ASSETS.avatarOpponent,
        },
        {
          id: 'me',
          name: profile.name,
          isHost: false,
          isReady: true,
          avatar: profile.avatar,
        },
      ],
    });
    soundFx.click(settings.soundEnabled, settings.hapticsEnabled);
    setScreen('room-lobby');
    showToast(`تم الانضمام إلى ${found.name}`);
    return null;
  };

  return (
    <IPhoneShell
      currentScreen={screen}
      onNavigate={navigate}
      viewport={viewport}
      onViewportChange={(v) => {
        soundFx.click(settings.soundEnabled, settings.hapticsEnabled);
        setViewport(v);
      }}
      settings={settings}
      onToggleSound={() =>
        setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))
      }
      onToggleHaptics={() =>
        setSettings((s) => ({ ...s, hapticsEnabled: !s.hapticsEnabled }))
      }
      onChangeBoardStyle={(style) => {
        soundFx.click(settings.soundEnabled, settings.hapticsEnabled);
        setSettings((s) => ({ ...s, boardStyle: style }));
        showToast(
          style === 'classic'
            ? 'تم الرجوع إلى التصميم السابق'
            : 'تم التبديل إلى تصميم الطاولة 3D'
        );
      }}
    >
      {/* Active Screen Render */}
      {screen === 'splash' && (
        <SplashScreen
          onContinue={() => navigate('auth')}
          onAutoComplete={() => navigate('home')}
          onSkipToHome={() => {
            switchActiveAccount('ضيف خلّص بنكك', true);
            navigate('home');
            showToast('تمت المتابعة كضيف');
          }}
        />
      )}

      {screen === 'auth' && (
        <AuthScreen
          onBack={() => navigate('splash')}
          onAuthSuccess={(name, isGuest) => {
            switchActiveAccount(name, isGuest);
            navigate('home');
            showToast(isGuest ? 'تم الدخول كضيف للتجربة' : `مرحباً ${name}`);
          }}
        />
      )}

      {screen === 'home' && (
        <HomeScreen
          profile={profile}
          onNavigate={navigate}
          onQuickStartAi={() => startAiMatch('skilled', settings.preferredTurnSeconds)}
          onOpenRules={() => setRulesOpen(true)}
          onClaimMissionReward={(rewardCoins, rewardXp) => {
            soundFx.victory(settings.soundEnabled, settings.hapticsEnabled);
            updateActiveProfile((p) =>
              applyProgressionRewardToProfile(p, rewardCoins, rewardXp)
            );
            showToast(`تمت إضافة +${rewardCoins} عملة و +${rewardXp} نقطة خبرة`);
          }}
          onClearNotifications={() => {
            updateActiveProfile((p) => ({ ...p, notificationsCount: 0 }));
          }}
          onSwitchAccount={(accountName, isGuest) => {
            soundFx.click(settings.soundEnabled, settings.hapticsEnabled);
            switchActiveAccount(accountName, isGuest);
            showToast(`تم التبديل إلى حساب: ${accountName}`);
          }}
        />
      )}

      {screen === 'mode-select' && (
        <ModeSelectScreen
          onBack={() => navigate('home')}
          onNavigate={navigate}
        />
      )}

      {screen === 'ai-setup' && (
        <AiSetupScreen
          defaultTurnSeconds={settings.preferredTurnSeconds}
          onBack={() => navigate('mode-select')}
          onStartMatch={startAiMatch}
        />
      )}

      {screen === 'multiplayer-hub' && (
        <MultiplayerHubScreen
          rooms={sampleRooms}
          onBack={() => navigate('home')}
          onNavigate={navigate}
          onSelectSampleRoom={(room) => {
            if (room.isLocked) {
              showToast('هذه الغرفة مغلقة حالياً — جرب غرفة مفتوحة');
              return;
            }
            handleJoinByCode(room.code);
          }}
        />
      )}

      {screen === 'create-room' && (
        <CreateRoomScreen
          defaultTurnSeconds={settings.preferredTurnSeconds}
          onBack={() => navigate('multiplayer-hub')}
          onCreateRoom={handleCreateRoom}
        />
      )}

      {screen === 'join-room' && (
        <JoinRoomScreen
          sampleRooms={sampleRooms}
          onBack={() => navigate('multiplayer-hub')}
          onJoinByCode={handleJoinByCode}
        />
      )}

      {screen === 'room-lobby' && (
        <RoomLobbyScreen
          room={activeRoom}
          onBack={() => navigate('multiplayer-hub')}
          onToggleLock={() => {
            soundFx.click(settings.soundEnabled, settings.hapticsEnabled);
            setActiveRoom((r) => {
              const nextLocked = !r.isLocked;
              showToast(nextLocked ? 'تم إغلاق الغرفة تجريبياً' : 'تم فتح الغرفة تجريبياً');
              return { ...r, isLocked: nextLocked };
            });
          }}
          onToggleDemoOpponent={() => {
            soundFx.click(settings.soundEnabled, settings.hapticsEnabled);
            setActiveRoom((r) => {
              if (r.players.length >= 2) {
                return { ...r, players: [r.players[0]] };
              }
              return {
                ...r,
                players: [
                  ...r.players,
                  {
                    id: 'demo_rival',
                    name: 'فهد الشمري (تجريبي)',
                    isHost: false,
                    isReady: true,
                    avatar: DESIGN_ASSETS.avatarOpponent,
                  },
                ],
              };
            });
          }}
          onToggleMyReady={() => {
            soundFx.click(settings.soundEnabled, settings.hapticsEnabled);
            setActiveRoom((r) => ({
              ...r,
              players: r.players.map((p, idx) =>
                idx === 0 ? { ...p, isReady: !p.isReady } : p
              ),
            }));
          }}
          onStartMatch={startRoomMatch}
          onLeaveRoom={() => {
            navigate('multiplayer-hub');
            showToast('غادرت الغرفة التجريبية');
          }}
        />
      )}

      {screen === 'game-board' &&
        (settings.boardStyle === 'table3d' ? (
          <Table3DGameBoard
            board={board}
            playerName={profile.name}
            playerAvatar={profile.avatar}
            largeCardText={settings.largeCardText}
            onSelectCard={handleSelectCard}
            onPlayToCenter={handlePlayToCenter}
            onMoveToDoor={handleMoveToDoor}
            onDrawCard={handleDrawCard}
            onSortHand={handleSortHand}
            onEndTurn={handleEndTurn}
            onResetBoard={() => {
              soundFx.turnSwitch(settings.soundEnabled, settings.hapticsEnabled);
              setBoard(
                createInitialBoardState({
                  matchLabel: board.matchLabel,
                  isAiMatch: board.isAiMatch,
                  difficulty: board.difficulty,
                  turnDurationSeconds: board.turnDurationSeconds,
                })
              );
              showToast('تم توزيع جولة جديدة');
            }}
            onRequestExit={() => setExitMatchConfirm(true)}
            onOpenRules={() => setRulesOpen(true)}
            onSimulateOutcome={handleSimulateOutcome}
            onSwitchToClassic={() => {
              soundFx.click(settings.soundEnabled, settings.hapticsEnabled);
              setSettings((s) => ({ ...s, boardStyle: 'classic' }));
              showToast('تم الرجوع إلى التصميم السابق');
            }}
          />
        ) : (
          <GameBoardScreen
            board={board}
            largeCardText={settings.largeCardText}
            onSelectCard={handleSelectCard}
            onPlayToCenter={handlePlayToCenter}
            onMoveToDoor={handleMoveToDoor}
            onDrawCard={handleDrawCard}
            onSortHand={handleSortHand}
            onEndTurn={handleEndTurn}
            onResetBoard={() => {
              soundFx.turnSwitch(settings.soundEnabled, settings.hapticsEnabled);
              setBoard(
                createInitialBoardState({
                  matchLabel: board.matchLabel,
                  isAiMatch: board.isAiMatch,
                  difficulty: board.difficulty,
                  turnDurationSeconds: board.turnDurationSeconds,
                })
              );
              showToast('تم توزيع جولة جديدة');
            }}
            onRequestExit={() => setExitMatchConfirm(true)}
            onOpenRules={() => setRulesOpen(true)}
            onSimulateOutcome={handleSimulateOutcome}
            onSwitchToTable3D={() => {
              soundFx.click(settings.soundEnabled, settings.hapticsEnabled);
              setSettings((s) => ({ ...s, boardStyle: 'table3d' }));
              showToast('تم التبديل إلى تصميم الطاولة 3D');
            }}
          />
        ))}

      {screen === 'results' && (
        <ResultsScreen
          outcome={outcome}
          onPlayAgain={() => {
            if (board.isAiMatch) {
              startAiMatch(board.difficulty, board.turnDurationSeconds);
            } else {
              startRoomMatch();
            }
          }}
          onBackHome={() => navigate('home')}
        />
      )}

      {screen === 'profile' && (
        <ProfileSettingsScreen
          profile={profile}
          settings={settings}
          onBack={() => navigate('home')}
          onNavigate={navigate}
          onUpdateName={(newName) => {
            updateActiveProfile((p) => ({ ...p, name: newName }));
            showToast('تم تحديث اسم اللاعب');
          }}
          onUpdateSettings={(partial) => {
            soundFx.click(settings.soundEnabled, settings.hapticsEnabled);
            setSettings((s) => ({ ...s, ...partial }));
          }}
          onOpenRules={() => setRulesOpen(true)}
          onRequestLogout={() => setLogoutConfirm(true)}
          onRequestDeleteAccount={() => setDeleteAccountConfirm(true)}
        />
      )}

      {/* Non-blocking Toast Banner */}
      {toastMsg && (
        <div
          role="status"
          className="pointer-events-none absolute top-4 inset-x-5 z-50 flex justify-center"
        >
          <div className="px-4 py-2 rounded-xl bg-[#071F19]/95 border border-[#D4A243]/50 text-xs font-semibold text-[#F7F3E9] shadow-xl">
            {toastMsg}
          </div>
        </div>
      )}

      {/* Rules & Prototype Bottom Sheet */}
      <RulesSheet open={rulesOpen} onClose={() => setRulesOpen(false)} />

      {/* Exit Match Confirmation */}
      <ConfirmModal
        open={exitMatchConfirm}
        title="إنهاء المباراة الحالية؟"
        message="سيتم إغلاق الطاولة والعودة إلى الشاشة الرئيسية."
        confirmLabel="نعم، خروج"
        destructive
        onCancel={() => setExitMatchConfirm(false)}
        onConfirm={() => {
          setExitMatchConfirm(false);
          navigate('home');
        }}
      />

      {/* Logout Confirmation */}
      <ConfirmModal
        open={logoutConfirm}
        title="تسجيل الخروج"
        message="هل تريد الخروج من الجلسة التجريبية الحالية والعودة إلى شاشة الدخول؟"
        confirmLabel="خروج"
        onCancel={() => setLogoutConfirm(false)}
        onConfirm={() => {
          setLogoutConfirm(false);
          navigate('auth');
        }}
      />

      {/* Delete Account Confirmation (App Store Requirement Preview) */}
      <ConfirmModal
        open={deleteAccountConfirm}
        title="حذف الحساب (معاينة)"
        message="هذا الإجراء يحاكي متطلب Apple App Store لإتاحة حذف الحساب من داخل التطبيق. لن يتم حذف أي بيانات حقيقية في هذا النموذج."
        confirmLabel="تأكيد الحذف التجريبي"
        destructive
        onCancel={() => setDeleteAccountConfirm(false)}
        onConfirm={() => {
          setDeleteAccountConfirm(false);
          switchActiveAccount('ضيف خلّص بنكك', true);
          navigate('splash');
          showToast('تمت محاكاة حذف الحساب بنجاح');
        }}
      />
    </IPhoneShell>
  );
}
